export default function SearchBar({
    search,
    setSearch,
    filter,
    setFilter,
    sort,
    setSort
}){

return(

<div className="search-toolbar">

<input
type="text"
placeholder="Search Vehicle..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<select
value={filter}
onChange={(e)=>setFilter(e.target.value)}
>

<option>All</option>
<option>Charging</option>
<option>Complete</option>

</select>

<select
value={sort}
onChange={(e)=>setSort(e.target.value)}
>

<option>Newest</option>
<option>Highest Energy</option>
<option>Lowest Energy</option>

</select>

</div>

)

}
