
import propTypes from "prop-types"
import Table from "../common/table"

const columns = [{path: "qrtag", key:1, label: "QRTag" }, {path: "uuid", key:2, label: "UUID" },{ path: "url", key: 3, label: "URL"}]
const sortColumn = { path: "uuid", order: "asc" }
const onSort = () =>{
    console.log("sort clicked")
}
// Data must be in this format
// const testTags = [{uuid: 1, url: "example"}, {uuid: 2, url: "example"}]
const Qrtag =(props)=>{
return(
    <div className="tag-info">
       <Table columns={columns} data={props.tags} sortColumn={sortColumn} onSort={onSort} />
    </div>
)
}

Qrtag.propTypes ={
    tags: propTypes.array.isRequired
}

export default Qrtag