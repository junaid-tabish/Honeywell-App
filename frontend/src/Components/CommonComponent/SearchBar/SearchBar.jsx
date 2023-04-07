import React from 'react';
import "./search.css";

export default function Search ({setSearch}) {
  return (
    <div>
  
  
  <form id="animated">
    <i class="fa fa-search" aria-hidden="true"></i>
    <input type="text" name="search"
     onChange={({ currentTarget: input }) => setSearch(input.value)}
     placeholder="Search.."></input>
  </form>
  </div>
  )
}




{/* onChange={({ currentTarget: input }) => setSearch(input.value)} */}
