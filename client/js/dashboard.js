const leaveBtn = document.querySelector(".leave-btn");
const createBtn = document.querySelector(".create-room");
const seeRoomBtn = document.querySelector(".see-room");
const roomList = document.getElementById('room-list');
const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");

const API_BASE = "https://socks-zz58.onrender.com";

leaveBtn.addEventListener("click", (e) => {
  e.preventDefault();
  sessionStorage.removeItem("auth-token");
  window.location.href = "login.html";
});

createBtn.addEventListener("click", function () {
  const roomName = document.getElementById("message-input").value;
  console.log("Room Name:", roomName);
  if (roomName === "") {
    console.log("room name is required");
    document.querySelector(
      ".error-text"
    ).innerHTML = `<p>Room name is required!</p>`;
  } else {
    axios
      .post(
        `${API_BASE}/api/chat`,
        {
          name: roomName,
        },
        {
          headers: {
            Authorization: `BEARER ${sessionStorage.getItem("auth-token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        alert("New room created");
      })
      .catch((error) => {
        document.querySelector(
          ".error-text"
        ).innerHTML = `<p>${error.response.data.error}</p>`;
      });
    // modal.style.display = "none";
    document.getElementById("message-input").value = "";
  }
});

seeRoomBtn.addEventListener('click', async () => {
    const availableRooms = await axios
    .get(
      `${API_BASE}/api/chat`,
      {
        headers: {
          Authorization: `BEARER ${sessionStorage.getItem("auth-token")}`,
        },
      }
    )
    .then((response) => {
      console.log('rooms',response.data);
      // alert("New room created");
      return response.data;
    })
    .catch((error) => {
      document.querySelector(
        ".available-error-text"
      ).innerHTML = `<p>${error.response.data.error}</p>`;
    });



    // availableRooms.forEach(room => {
    //     const li = document.createElement('li');
    //     li.textContent = room.name;
    //     li.addEventListener('click', () => {
    //         handleRoomClick(room);
    //     });
    //     roomList.appendChild(li);
    // });

  // ------------------------------------------------------------------ start
  const chatRoomList = document.querySelector('.chatRoomList');

  if (!availableRooms || !availableRooms.length) {
    document.querySelector('.roomListTitle').textContent = 'No Room Available!';
    document.querySelector('.roomListTitle').style.display = 'block';
    chatRoomList.querySelector('ul').style.display = 'none';
  } else {
    document.querySelector('.roomListTitle').textContent = 'Available Chat Rooms';
    document.querySelector('.roomListTitle').style.display = 'block';
    chatRoomList.querySelector('ul').style.display = 'block';
    document.getElementById('room-list').innerHTML = '';

    availableRooms.forEach(room => {
      const li = document.createElement('li');
      
      // 1. Create a span for the room name (Click to Join)
      const nameSpan = document.createElement('span');
      nameSpan.textContent = room.name;
      nameSpan.style.cursor = "pointer";
      nameSpan.style.flexGrow = "1"; // Push delete button to the right
      nameSpan.addEventListener('click', () => {
        handleRoomClick(room);
      });

      // 2. Create the Delete Button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = "🗑️"; 
      deleteBtn.style.marginLeft = "10px";
      deleteBtn.style.background = "transparent";
      deleteBtn.style.border = "none";
      deleteBtn.style.cursor = "pointer";
      deleteBtn.title = "Delete Room";

      // 3. Attach Delete Event
      deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation(); // Stop the click from joining the room
        
        if(confirm(`Are you sure you want to delete room "${room.name}"?`)) {
            try {
                await axios.delete(
                    `${API_BASE}/api/chat/${room.id}`,
                    {
                        headers: {
                            Authorization: `BEARER ${sessionStorage.getItem("auth-token")}`,
                        },
                    }
                );
                alert("Room deleted!");
                // Refresh the list immediately
                seeRoomBtn.click(); 
            } catch (error) {
                console.error(error);
                alert("Failed to delete room");
            }
        }
      });

      // 4. Style the list item layout
      li.style.display = "flex";
      li.style.justifyContent = "space-between";
      li.style.alignItems = "center";
      
      // 5. Append elements
      li.appendChild(nameSpan);
      li.appendChild(deleteBtn);
      
      roomList.appendChild(li);
    });
  }
  // ------------------------------------------------------------------ end
    
});

const handleRoomClick = async (room) => {
    console.log('Room Clicked');
    window.location.href = `chat.html?roomId=${room.id}&roomName=${room.name}`
}
//   if (!availableRooms.length) {
//     document.querySelector('.roomListTitle').textContent = 'No Room Available!';
//     document.querySelector('.roomListTitle').style.display = 'block';
//     chatRoomList.querySelector('ul').style.display = 'none';
//   } else {
//     document.querySelector('.roomListTitle').style.display = 'block';
//     chatRoomList.querySelector('ul').style.display = 'block';
//     document.getElementById('room-list').innerHTML = '';

//     availableRooms.forEach(room => {
//       const li = document.createElement('li');
//       li.textContent = room.name;
//       li.addEventListener('click', () => {
//         handleRoomClick(room);
//       });
//       roomList.appendChild(li);
//     });
//   }

//   // ------------------------------------------------------------------ end
    
// });

// const handleRoomClick = async (room) => {
//     console.log('Room Clicked');
//     window.location.href = `chat.html?roomId=${room.id}&roomName=${room.name}`
// }

// //   createBtn.addEventListener("click", (e) => {
// //     e.preventDefault();
// //     modal.style.display = "block";
// //   });

// //   closeBtn.addEventListener("click", function() {
// //       document.getElementById('roomNameInput').value='';
// //       modal.style.display = "none";
// //     });

// //   cancelBtn.addEventListener("click", function() {
// //     document.getElementById('roomNameInput').value='';
// //     modal.style.display = "none";
// //   });
