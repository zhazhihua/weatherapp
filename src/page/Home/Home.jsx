import './Home.css'
import * as echarts from 'echarts'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import locationImg from './images/location.png'
function Home(props) {
    const [nowWeather, setnowWeather] = useState({})
    function getTodayWeatherData(city) {
        axios.get(`https://devapi.qweather.com/v7/weather/24h?location=${city}&key=2daf467fb78c464099b517c36df98d90`)
            .then(res => {
                console.log(res.data.hourly);
            })
    }
    function getNowWeatherData(city) {
        axios.get(`https://devapi.qweather.com/v7/weather/now?location=${city}&key=2daf467fb78c464099b517c36df98d90`)
            .then(res => {
                //console.log(res.data.now);
                setnowWeather(nowWeather=>res.data.now)
                console.log(nowWeather);
            })
    }
    function goselectCity() {
        props.history.push('/city')
    }
    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };
    const chartRef = useRef(null);
    useEffect(() => {
        //getTodayWeatherData(101010100);
        //getNowWeatherData(101010100);
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
                <span>16°</span>
            </div>
            <div className='wind'>
                <span>阴&nbsp;&nbsp;|&nbsp;&nbsp;北风三级</span>
            </div>
            <div className='air'>
                9优
            </div>
            <p className='todayWeather'>
                今天阴转多云 14至20℃ 北风4-5级
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