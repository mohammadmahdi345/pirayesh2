import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Search = () => {

    const [search,setSearch] = useState('')
    const [result,setResult] = useState([])

    function handelchange(e){
        const value = e.currentTarget.value;
        setSearch(value)
    }

    async function handelclick(){
        try {
            const response = await axios.get(`http://localhost:8005/search/${search}`)
            setResult(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
        <div className='search'>
            
            <input
                type='text'
                placeholder='جست و جو'
                value={search}
                onChange={handelchange} 
            />
            <button className='search1' onClick={handelclick}>search</button>

            <ul className='result'>
                {result.map((item, i) => (
                    <li className='result1' key={i}>{item.name}</li>
                ))}
            </ul>
        </div>
        </>
    );
}

export default Search;
