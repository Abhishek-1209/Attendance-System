import React from 'react'
import studentdata from '../Json/Studentdata'

const Studentlist = () => {
  return (
    <div>
      {studentdata.map((item, index)=>(
        <div key={index} className="flex flex-row justify-between">
        <h5>{item.roll}</h5>
        <h5>{item.name}</h5>
        <h5>{item.section}</h5>
        <h5>{item.image}</h5>
        </div>
      ))}
    </div>
  )
}

export default Studentlist
