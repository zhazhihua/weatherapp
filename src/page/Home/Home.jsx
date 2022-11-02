import './Home.css'
import * as echarts from 'echarts'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import locationImg from './images/location.png'
function Home(props) {
    const [nowWeather,setnowWeather] = useState({})
    function getTodayWeatherData(city) {
        axios.get(`https://v0.yiketianqi.com/api/worldchina?appid=24831698&appsecret=p8sIVJ6B`)
            .then(res => {
                console.log(res.data);
            })
    }
    function getNowWeatherData(city) {
        axios.get(`https://v0.yiketianqi.com/api?unescape=1&version=v61&appid=24831698&appsecret=p8sIVJ6B&city=${city}`)
            .then(res => {
                console.log(res.data);
                setnowWeather(res.data)
            })
    }
    function goselectCity() {
        getTodayWeatherData();
        //getNowWeatherData('南昌');
        props.history.push('/city')
    }
    const chartRef = useRef(null);
    useEffect(() => {
        let chartInstance = echarts.init(chartRef.current);
        const option = {
            xAxis: {
                type: 'category',
                data: ['现在', '11时', '12时', '13时', '14时', '15时', '16时'],
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    },
                }
            },
            yAxis: {
                show: false,
                type: 'value',
            },
            series: [
                {
                    data: [16, 18, 18, 21, 22, 18, 15],
                    type: 'line',
                    label: {
                        show: true,
                        formatter(data) {
                            return data.value + '°'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#fff', //改变折线点的颜色
                            lineStyle: {
                                color: '#fff' //改变折线颜色
                            }
                        }
                    },
                },
            ],
        };
        chartInstance.setOption(option);
    },[])
    return (
        <div className='Home'>
            <div className='location' onClick={goselectCity}>
                <span>南昌</span><img src={locationImg} alt="" />
            </div>
            <div className='temperature'>
                <span>{nowWeather.tem}°</span>
            </div>
            <div className='wind'>
                <span>{nowWeather.wea}&nbsp;&nbsp;|&nbsp;&nbsp;{nowWeather.win}{nowWeather.win_speed}</span>
            </div>
            <div className='air'>
                {nowWeather.air_pm25}{nowWeather.air_level}
            </div>
            <p className='todayWeather'>
                今天:阴转多云 {nowWeather.tem2}至{nowWeather.tem1}℃ 北风4-5级
                <select>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
            </p>
            <div ref={chartRef} style={{ height: "40vh" }}></div>
            <div className='date'>
                <ul>
                    <li>
                        <p>昨天</p>
                        <p>10/08</p>
                    </li>
                    <li>
                        <p>今天</p>
                        <p>10/08</p>
                    </li>
                    <li>
                        <p>明天</p>
                        <p>10/08</p>
                    </li>
                    <li>
                        <p>周二</p>
                        <p>10/08</p>
                    </li>
                    <li>
                        <p>周三</p>
                        <p>10/08</p>
                    </li>
                </ul>
            </div>
        </div>
    )
}
export default Home