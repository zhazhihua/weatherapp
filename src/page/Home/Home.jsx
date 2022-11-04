import './Home.css'
import * as echarts from 'echarts'
import { useEffect, useRef, useState } from 'react'
import { AudioOutlined } from '@ant-design/icons';
import { Select, Input, Space } from 'antd';
import axios from 'axios'
import data from '../../icon.json'
import 'antd/dist/antd.css'

function Home(props) {
    const [nowWeather, setnowWeather] = useState({})
    const [hours, sethours] = useState([])
    const [month, setmonth] = useState([])
    const [city, setcity] = useState('南昌')
    const [dayforecast, setdayforecast] = useState(0)
    const [count, setcount] = useState(0)
    const { Search } = Input;
    const suffix = (
        <AudioOutlined
            style={{
                fontSize: 16,
                color: '#1890ff',
            }}
        />
    );
    const onSearch = (value) => {
        setcount(0)
        setcity(value)
    }
    function showecharts() {
        let chartInstance = echarts.init(chartRef.current);
        const option = {
            xAxis: {
                type: 'category',
                data: hours.map((item) => {
                    return dayforecast == 1 ? (item.date || '').slice(5) : item.time
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
                    data: hours.map((item) => {
                        return dayforecast == 1 ? (item.day || {}).temperature : item.tem
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
    function changeForecast(e) {
        setdayforecast(e.target.value)
        setcount(0)
        getWeatherData()
    }
    function getWeatherData() {
        axios.get(`https://v0.yiketianqi.com/api/worldchina?appid=24831698&appsecret=p8sIVJ6B&city=${city}`)
            .then(res => {
                if (dayforecast == 1) {
                    sethours(res.data.month.slice(0, 5))
                    setmonth(res.data.month.slice(0, 5))
                } else {
                    sethours(res.data.hours.slice(0, 5))
                    setmonth(res.data.month.slice(0, 5))
                }
            })
    }
    function getNowWeatherData() {
        axios.get(`https://v0.yiketianqi.com/api?unescape=1&version=v61&appid=24831698&appsecret=p8sIVJ6B&city=${city}`)
            .then(res => {
                setnowWeather(res.data)
            })
    }
    const handleChange = (value) => {
        setcount(0)
        setcity(value)
    };
    const chartRef = useRef(null);
    useEffect(() => {
        setcount(count + 1)
        if (count < 1) {
            getWeatherData();
            getNowWeatherData();
        }
        showecharts()
    }, [nowWeather, hours, month, city])
    return (
        <div className='Home'>
            <div className='location'>
                <Select
                    size='small'
                    bordered={false}
                    defaultValue="南昌"
                    style={{
                        width: 120,
                    }}
                    onChange={handleChange}
                    options={[
                        {
                            value: '南昌',
                            label: '南昌',
                        },
                        {
                            value: '上海',
                            label: '上海',
                        },
                        {
                            value: '北京',
                            label: '北京',
                        },
                    ]}
                />
                <Search size='small' placeholder="输入城市" onSearch={onSearch} style={{'margin-left':'30px', width: 150,height:15 }} />
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
            <ul className='pic'>
                {
                    hours.map((item, index) => {
                        return dayforecast == 1 ? <li className={`iconfont ${data[(item.day || {}).icon]}`} key={index}></li> : <li className={`iconfont ${data[item.icon]}`} key={index}></li>
                    })
                }
            </ul>

            <div ref={chartRef} style={{ height: "40vh" }}></div>
            <div className='date'>
                <ul>
                    {
                        month.map((item, index) => {
                            if (index === 0) item.dateOfWeek = '今天'
                            if (index === 1) item.dateOfWeek = '明天'
                            return (
                                <li key={index}>
                                    <p>{item.dateOfWeek}</p>
                                    <p>{item.date.split("-")[1] + '/' + item.date.split("-")[2]}</p>
                                    <p><i className={`iconfont ${data[item.day.icon]}`}></i></p>
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