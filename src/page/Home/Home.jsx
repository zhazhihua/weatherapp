import './Home.css'
import * as echarts from 'echarts'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import locationImg from './images/location.png'

function Home(props) {
    const [nowWeather,setnowWeather] = useState({})
    const [hours,sethours] = useState([])
    const [month,setmonth] = useState([])
    const [city,setcity] = useState('南昌')
    const [dayforecast,setdayforecast] = useState(0)
    const [count,setcount] = useState(0)
    function showecharts(){
        let chartInstance = echarts.init(chartRef.current);
        const option = {
            xAxis: {
                type: 'category',
                data: hours.map((item)=>{
                    return dayforecast?(item.date || '').slice(5):item.time
                }),
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
                    data: hours.map((item)=>{
                        return dayforecast?(item.day || '').temperature:item.tem
                    }),
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
    }
    function changeForecast(e){
        setdayforecast(e.target.value)
        setcount(0)
        getWeatherData()
    }
    function getWeatherData() {
        axios.get(`https://v0.yiketianqi.com/api/worldchina?appid=24831698&appsecret=p8sIVJ6B&city=${city}`)
            .then(res => {
                if(dayforecast == 1) {
                    sethours(res.data.month.slice(0,5))
                    setmonth(res.data.month.slice(0,5))
                }else{
                    sethours(res.data.hours.slice(0,5))
                    setmonth(res.data.month.slice(0,5))
                }
            })
    }
    function getNowWeatherData() {
        axios.get(`https://v0.yiketianqi.com/api?unescape=1&version=v61&appid=24831698&appsecret=p8sIVJ6B&city=${city}`)
            .then(res => {
                setnowWeather(res.data)
            })
    }
    function goselectCity() {
        props.history.push('/city')
    }
    const chartRef = useRef(null);
    useEffect(() => {
        console.log(props)
        setcount(count+1)
        if(count<1){
            getWeatherData();
            //getNowWeatherData();
        }
        showecharts()
    },[nowWeather,hours,month])
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
                今天:&nbsp;&nbsp;{nowWeather.wea}&nbsp;&nbsp; {nowWeather.tem2}至{nowWeather.tem1}℃ &nbsp;&nbsp;{nowWeather.win}{nowWeather.win_speed}
                <select onChange={changeForecast}>
                    <option value={0}>24小时预报</option>
                    <option value={1}>五天预报</option>
                </select>
            </p>
            <div ref={chartRef} style={{ height: "40vh" }}></div>
            <div className='date'>
                <ul>
                    {
                        month.map((item,index)=>{
                            if(index === 0) item.dateOfWeek = '今天'
                            if(index === 1) item.dateOfWeek = '明天'
                            return (
                                <li key={index}>
                                    <p>{item.dateOfWeek}</p>
                                    <p>{item.date.split("-")[1] + '/' + item.date.split("-")[2]}</p>
                                </li>
                            )  
                        })
                    }
                </ul>
            </div>
        </div>
    )
}
export default Home