// Load Categories
const loadCategories = async () => {
    const url = 'https://openapi.programming-hero.com/api/peddy/categories';
    const response = await fetch(url);
    const data = await response.json();
    displayCategories(data.categories);
}

loadCategories();

const displayCategories = (items) => {
    const categoryContainer = document.getElementById('categories');
    items.forEach(item => {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('flex', 'justify-between');
        buttonContainer.innerHTML = `
    <button id="btn-${item.category}" class="category-btn text-xl sm:text-lg font-bold gap-2 hover:bg-[#0E7A811A] duration-200 easy-in-out
    sm:gap-4 flex justify-between items-center p-3 lg:p-6 border border-teal-500 rounded-lg" 
            onclick="loadCategoryPets('${item.category}')">
            <img src="${item.category_icon}" class="w-6 h-6 sm:w-8 sm:h-8 object-contain">
            ${item.category}
        </button>
`;
        categoryContainer.appendChild(buttonContainer);
    });
};
//Removing active class buttons
const removeActiveClass = () => {
    const buttons = document.getElementsByClassName('category-btn');
    for (let btn of buttons) {
        btn.classList.remove('active-cls');
    }
}
// Load All Pets
const loadAllPets = async () => {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.remove('spinner-hidden');
    const url = 'https://openapi.programming-hero.com/api/peddy/pets';
    setTimeout(async function () {
        try {
            const response = await fetch(url);
            const data = await response.json();
            pets = data.pets;
            displayAllPets(pets);
        } catch (error) {
            console.error("Error fetching pets:", error);
        } finally {
            spinner.classList.add('spinner-hidden');
        }
    }, 2000);
}

loadAllPets();

// Display All Pets
const displayAllPets = (pets) => {
    const allPetsContainer = document.getElementById('all-pets');
    allPetsContainer.innerHTML = '';

    //No-content section
    if (pets.length == 0) {
        allPetsContainer.classList.remove('grid');
        allPetsContainer.innerHTML =
            `
        <div class="min-h-[300px] flex flex-col gap-5 justify-center items-center">
        <img src="images/error.webp" />
        <h2 class="text-center text-xl font-bold ">
        No Information Available
        </h2>
        <p>No such pets available right now,will be arriving very soon.Thank you for your patience</p>
        </div>
        `;
        return;
    }
    else {
        allPetsContainer.classList.add('grid');
    }

    pets.forEach(pet => {
        const allPetsDiv = document.createElement('div');
        allPetsDiv.classList.add('p-4', 'border', 'bg-white', 'mb-4', 'rounded-lg');
        allPetsDiv.innerHTML = `
        <div class="h-[200px]">
          <img src="${pet.image}" alt="${pet.pet_name}" class="h-full w-full object-cover rounded-md">
        </div>
        <div class="mt-4">
          <h3 class="text-xl font-semibold">${pet.pet_name}</h3>
          <div><i class="fa-solid fa-dog"></i> <span>Breed: ${pet.breed ? `${pet.breed}` : 'Not Specified'}</span></div>
          <div><i class="fa-regular fa-calendar"></i> <span>Birth: ${pet.date_of_birth ? `${pet.date_of_birth}` : 'Unknown'}</span></div>
          <div><i class="fa-solid fa-venus-mars"></i> <span>Gender: ${pet.gender ? `${pet.gender}` : 'Not Specified'}</span></div>
          <div><i class="fa-solid fa-dollar-sign"></i> <span>Price: ${pet.price ? `$${pet.price}` : 'Contact for price'}</span></div>
        </div>
        <div class="flex justify-between p-3 items-center mt-4 space-x-2">
        <button class="border border-teal-500 text-black p-2 rounded-lg text-lg font-semibold  flex-grow hover:bg-[#0E7A811A] duration-300 easy-in-out" onclick="likedPets('${pet.petId}')">
        <i class="fa-regular fa-thumbs-up"></i>
        </button>
        <button  onclick="handleAdoption(this)" class="border border-teal-500 text-teal-600 text-lg font-semibold  p-2 rounded-lg flex-grow">
         Adopt
        </button>
        <button class="border border-teal-500 text-teal-600  p-2 rounded-lg text-lg font-semibold flex-grow hover:bg-[#0E7A811A] duration-300 easy-in-out " onclick="loadPetDetails('${pet.petId}')" >
        Details
       </button>
        </div>

      `;
        allPetsContainer.appendChild(allPetsDiv);
    });
};
//Displaying all pets by sorting by price (STARTS)
let pets = [];
const sortByPrice = () => {
    if (pets.length > 0) {
        pets.sort((a, b) => b.price - a.price);
        displayAllPets(pets);
    }
};
document.querySelector('.sort-btn').addEventListener('click', sortByPrice);
//Displaying all pets by sorting by price (ENDS)

//Displaying Pets Category-wise
const loadCategoryPets = (category) => {
      const allPetsContainer = document.getElementById('all-pets');
      allPetsContainer.innerHTML='';
      allPetsContainer.innerHTML=
      `
      <div id="loading-spinner" class="spinner-hidden absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
        <span class="loading loading-bars loading-lg"></span>
      </div>
      `  
    const url = `https://openapi.programming-hero.com/api/peddy/category/${category}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const activeBtn = document.getElementById(`btn-${category}`);
            //deactivating all buttons
            removeActiveClass();
            //activating specific button
            activeBtn.classList.add('active-cls');
            pets = data.data;
            setTimeout(function(){
                displayAllPets(pets);
            },2000)
           
        })
        .catch(error => {
            console.error("Error occurs fetching categorical pets data:", error);
        });
};
//Liked pet image in the liked section
const likedPets = (id) => {
    const url = `https://openapi.programming-hero.com/api/peddy/pet/${id}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const petData = data.petData;
            const image = petData.image;
            const likedContainer = document.getElementById('liked-card');
            const likedPetDiv = document.createElement('div');
            likedPetDiv.classList.add('h-[150px]', 'mt-4');
            likedPetDiv.innerHTML = `
                <img src="${image}" class="h-full w-full object-cover rounded-md">
            `;
            likedContainer.appendChild(likedPetDiv);
        })
        .catch(error => {
            console.error("Error occurs fetching liked pets:", error);
        });
};

//Displaying individual pets details
const loadPetDetails = async (id) => {
    const url = `https://openapi.programming-hero.com/api/peddy/pet/${id}`;
    const response = await fetch(url);
    const data = await response.json();
    displayDetails(data.petData);
}
const displayDetails = (pets) => {
    const detailContainer = document.getElementById('modal-content');
    detailContainer.innerHTML =
        `
<img src="${pets.image}" class="h-full w-full object-cover rounded-md">
<div class="mt-2">
 <h3 class="text-3xl font-semibold">${pets.pet_name}</h3>
<div class="border-b-2 flex gap-x-4">
<div>
     <div><i class="fa-solid fa-dog"></i> <span>Breed: ${pets.breed ? `${pets.breed}` : 'Not Specified'}</span></div>
     <div><i class="fa-solid fa-venus-mars"></i> <span>Gender: ${pets.gender ? `${pets.gender}` : 'Not Specified'}</span></div>
     <div><i class="fa-solid fa-syringe"></i> <span>Vaccinated Status: ${pets.vaccinated_status ? `${pets.vaccinated_status}` : 'Not Applicable'}</span></div>
</div>
<div>
<div><i class="fa-regular fa-calendar"></i> <span>Birth: ${pets.date_of_birth ? `${pets.date_of_birth}` : 'Unknown'}</span></div>
<div><i class="fa-solid fa-dollar-sign"></i> <span>Price: ${pets.price ? `$${pets.price}` : 'Contact for price'}</span></div>
</div>
</div>
</div>
<p class="font-semibold text-lg">Details Information</p>
<p>${pets.pet_details}</p>
`
    document.getElementById('detailsModal').showModal();
}

//Adopting the pet by modal
const handleAdoption = (adoptButton) => {
    const modal = document.getElementById('adoptionModal');
    const countdownTimer = document.getElementById('countdown-timer');
    modal.showModal();
    let countDown = 3;
    countdownTimer.innerText = 3;
    const countDownInterval = setInterval(() => {
        countDown = countDown - 1;
        countdownTimer.innerText = countDown;
        if (countDown === 0) {
            clearInterval(countDownInterval);
            adoptButton.innerText = "Adopted";
            adoptButton.disabled = true;
            adoptButton.classList.add('bg-teal-600', 'text-gray-100');
            modal.close()
        }
    }, 1000)
}
