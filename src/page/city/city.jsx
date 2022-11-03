import './city.css'

function City(props){
    function changecity(e){
        props.history.push(`/home?city=${e.target.value}`)
    }
    return(
        <div className='City'>
            <input type="text" onMouseLeave={changecity}/>
        </div>
    )
}
export default City