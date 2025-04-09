import { useState } from "react"

function UserList() {
    
    const [users, setUsers] = useState([])

    const fetchUsers = () => {
        fetch("http://localhost:3000/users/register")
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((error) => console.error("Error:", error))
    }

    return (
        <div className="container" id="userlist">
            <h2>Testing</h2>
            <button onClick={fetchUsers}>Get All Users</button>
            <div>
                {users.map((user, index) => (
                    <div className="container" key={index}>
                        <img src={user.profilepic} width="100" alt="user.email" />
                        {user.email}
                        {user.role}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserList