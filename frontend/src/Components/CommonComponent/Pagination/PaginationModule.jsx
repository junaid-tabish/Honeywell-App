import React from 'react'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function PaginationModule({page,count,setPage}) {
  const handleChange=  (event,value)=>{
    setPage(value);
}

  return (
    <div>
        <>
       <Stack spacing={2}>
      <Pagination count={count} page={page} shape='rounded' onChange={handleChange} color="primary" /> 
      </Stack>
      </>
    </div>
  )
}
