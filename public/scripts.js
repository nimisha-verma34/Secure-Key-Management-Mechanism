document.getElementById('registerForm').addEventListener('submit', registerUser);
document.getElementById('loginForm').addEventListener('submit', loginUser);

async function registerUser(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const dob = document.getElementById('dob').value;
  const country = document.getElementById('country').value;
  const state = document.getElementById('state').value;
  const city = document.getElementById('city').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const data = {
    name,
    dob,
    country,
    state,
    city,
    email,
    password
  };

  try {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();
    alert(responseData.message); // Display result in alert
  } catch (error) {
    console.error('Error:', error);
    alert('Server error');
  }
}

async function loginUser(e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const data = {
    email,
    password
  };

  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const userData = await response.json();
    if (userData.message) {
      alert(userData.message); // Display result in alert
    } else {
      alert(`Logged in as ${userData.name}\nDOB: ${userData.dob}\nCountry: ${userData.country}\nState: ${userData.state}\nCity: ${userData.city}`); // Example: Display user name after login
     
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Server error');
  }
}



