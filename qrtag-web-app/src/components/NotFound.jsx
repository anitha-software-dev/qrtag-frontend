

const NotFound = () =>{
    console.error("Error Code: 404 Page Not Found")
    return (
        <div >
            <h1 className="text-center">Error: 404</h1>
            <p className="text-center">The page you are looking for could not be found.</p>
        </div>
    )
        
}

export default NotFound