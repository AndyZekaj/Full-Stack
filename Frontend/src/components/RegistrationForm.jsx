

function RegistrationForm() {
    const handleSubmit = (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        for (let pair of formData.entries()) {
            console.log(pair[0] + ": " + pair[1])
        }

        fetch("http://localhost:3000/users/register", {
            method: "POST",
            body: formData,
        })
        .then((response) => {
            if (response.ok) {
                alert("Registration successful!")
            } else {
                alert("Registration failed.")
            }
        })
        .catch((error) => {
            console.error("Error:", error)
            alert("An error occurred.")
        })
    }
    return (
        <div className="container">
            <h2>User Registration</h2>
            <form id="registrationForm" onSubmit={handleSubmit}>
            <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required/>
                </div>
                <div className="form-group">
                    <label htmlFor="profilepic">Profile Picture</label>
                    <input type="file" id="profilepic" name="profilepic" required/>
                </div>
                <div className="form-group">
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    )
};

export default RegistrationForm