type  MapItemType =  {

    [key:string] :string | number
};


const MAP_ITEMS : MapItemType ={
    DAY :'DAY',
    MONTH : 'MONTH',
    YEAR : "YEAR",
    DAY_AND_TIME : "DAY_AND_TIME",
    TIME : "TIME"
}

export default MAP_ITEMS;