document.getElementById("logout").addEventListener("click",async (event) => {
    fetch("http://127.0.0.1:3000/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
            
        window.location.href = "/"

    })
    .catch((error) => {
        console.error("Registration error: " + error.message);
        alert("Registration failed. Please try again later.");
    });
})


// export const deletePost = (req, res) => {
//     const token = req.cookies.access_token;
//     if (!token) return res.status(401).json("Not authenticated!");
  
//     // jwt.verify(token, "jwtkey", (err, userInfo) => {
//     //   if (err) return res.status(403).json("Token is not valid!");
  
//       const userId = req.params.id;
//       const q = "DELETE FROM usersdata WHERE `id` = ?";
  
//       db.query(q, [userId], (err, data) => {
//         if (err) return res.status(403).json("You can delete only your user!");
  
//         return res.json("User has been deleted!");
//       });
//     // });
//   };


// document.addEventListener("DOMContentLoaded", () => {
//     const userList = document.getElementById("user-list");

//     // Make a GET request to retrieve the list of users from your server.
//     fetch("http://127.0.0.1:3000/users")
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);
//         if (data && data.length > 0) {
//             console.log("users are more");
//           data.forEach((user) => {
//             const userCard = document.createElement("div");
//             userCard.classList.add("user-card");

//             const usernameHeading = document.createElement("h2");
//             usernameHeading.textContent = user.username;

//             const emailPara = document.createElement("p");
//             emailPara.textContent = `Email: ${user.email}`;

//             userCard.appendChild(usernameHeading);
//             userCard.appendChild(emailPara);

//             userList.appendChild(userCard);
//           });
//         } else {
//           const noUsersMessage = document.createElement("p");
//           noUsersMessage.textContent = "No users found.";
//           userList.appendChild(noUsersMessage);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching user data: ", error);
//       });
//   });

  document.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('user-list');

    const updateForm = document.getElementById('update-user-form');
    const updateUsernameInput = document.getElementById('update-username');
    const updateEmailInput = document.getElementById('update-email');
    const updatePasswordInput = document.getElementById('update-password');
    const updateButton = document.getElementById('update-user-button');


    function updateUser(userId) {
        // Show the update form
        updateForm.style.display = 'block';

        // Handle the update action
        updateButton.addEventListener('click', () => {
            const newUsername = updateUsernameInput.value;
            const newEmail = updateEmailInput.value;
            const newPassword = updatePasswordInput.value;

            // Send the updated data to the update API
            fetch(`/update-user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: newUsername, email: newEmail, password: newPassword }),
            })
            .then((response) => response.json())
            .then((data) => {
                // Handle the response, e.g., show a success message
                console.log('Update success', data);
                // Hide the update form
                updateForm.style.display = 'none';
            })
            .catch((error) => {
                // Handle errors, e.g., show an error message
                console.error('Update error: ', error);
            });
        });
    }


    function deleteUser(userId) {
        // Implement the logic to delete a user (e.g., show a confirmation dialog).
        // You can use a library like SweetAlert or a custom confirmation dialog.
        fetch(`http://127.0.0.1:3000/deleteuser/${userId}`,{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                window.location.reload()
            }).catch(err=>alert(err))
    }

    // Make a GET request to retrieve the list of users from your server.
    fetch('http://127.0.0.1:3000/users')
        .then((response) => response.json())
        .then((data) => {
            if (data && data && data.length > 0) {
                data.forEach((user) => {
                    const userCard = document.createElement('div');
                    userCard.classList.add('user-card');
                    
                    const usernameHeading = document.createElement('h2');
                    usernameHeading.textContent = user.username;
                    
                    const emailPara = document.createElement('p');
                    emailPara.textContent = `Email: ${user.email}`;
                    
                    const updateButton = document.createElement('button');
                    updateButton.textContent = 'Update';
                    updateButton.addEventListener('click', () => updateUser(user.id));
                    
                    const deleteButton = document.createElement('button');
                    userCard.classList.add('delete-user');
                    
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', () => deleteUser(user.id));

                    userCard.appendChild(usernameHeading);
                    userCard.appendChild(emailPara);
                    userCard.appendChild(updateButton);
                    userCard.appendChild(deleteButton);

                    userList.appendChild(userCard);
                });
            } else {
                const noUsersMessage = document.createElement('p');
                noUsersMessage.textContent = 'No users found.';
                userList.appendChild(noUsersMessage);
            }
        })
        .catch((error) => {
            console.error('Error fetching user data: ', error);
        });
});
