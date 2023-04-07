import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import { useState } from "react";
import {TbArrowsSort, TbSortAscendingLetters, TbSortDescendingLetters} from 'react-icons/tb'


export const Sortmenu = ({header, value, changeSortAndOrder, activeColumn, columnOrder}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  let icon;
  if(activeColumn !== value){
    icon = <TbArrowsSort/>
  }
  if(activeColumn === value && columnOrder === 'desc'){
    icon = <TbSortDescendingLetters/>
  }
  if(activeColumn === value && columnOrder === 'asc'){
    icon = <TbSortAscendingLetters/>
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (sort='', order='desc') => {
    if(sort === ''){
        setAnchorEl(null);
    }else{
        setAnchorEl(null)
        changeSortAndOrder(sort, order)
    }
    
  };
    return (
      <div>
        <Button
          id="fade-button"
          aria-controls={open ? "fade-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          sx={{color: "white"}}
          endIcon = {icon}
        >
          {header}
        </Button>
        <Menu
          id="fade-menu"
          MenuListProps={{
            "aria-labelledby": "fade-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={() => handleClose()}
          TransitionComponent={Fade}
        >
          <MenuItem onClick={() => handleClose(value, 'asc')}>Asc</MenuItem>
          <MenuItem onClick={() => handleClose(value, 'desc')} >Desc</MenuItem>
          <MenuItem onClick={() => handleClose('createdAt', 'desc')}>No Sort</MenuItem>
        </Menu>
      </div>
    );
}
