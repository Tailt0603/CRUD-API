var newMemberAddBtn = document.querySelector('.addMemberBtn'),
darkBg = document.querySelector('.dark_bg'),
popupForm = document.querySelector('.popup'),
crossBtn = document.querySelector('.closeBtn'),
submitBtn = document.querySelector('.submitBtn'),
 modalTitle = document.querySelector('.modalTitle'),
 popupFooter = document.querySelector('.popupFooter'),
 imgInput = document.querySelector('.img'),
 imgHolder = document.querySelector('.imgholder')
 form = document.querySelector('form'),
 formInputFields = document.querySelectorAll('form input'),
  uploadimg = document.querySelector("#uploadimg"),
  fName = document.getElementById("fName"),
  lName = document.getElementById("lName"),
  age = document.getElementById("age"),
  city = document.getElementById("city"),
  position = document.getElementById("position"),
  salary = document.getElementById("salary"),
  sDate = document.getElementById("sDate"),
  email = document.getElementById("email"),
  phone = document.getElementById("phone"),
  entries = document.querySelector(".showEntries"),
  tabSize = document.getElementById("table_size"),
  userInfo = document.querySelector(".userInfo"),
  table = document.querySelector("table"),
  filterData = document.getElementById("search")


let originalData = []
let getData = []


async function fetchDataFromAPI() {
    try {
        const response = await fetch('https://67185641b910c6a6e02bb95e.mockapi.io/users');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function initializeData() {
    originalData = await fetchDataFromAPI();
    getData = originalData;
    showInfo();
    displayIndexBtn();
}


initializeData();


let isEdit = false, editId

var arrayLength = 0
var tableSize = 10
var startIndex = 1
var endIndex = 0
var currentIndex = 1
var maxIndex = 0

showInfo()


newMemberAddBtn.addEventListener('click', ()=> {
    isEdit = false
    submitBtn.innerHTML = "Submit"
    modalTitle.innerHTML = "Fill the Form"
    popupFooter.style.display = "block"
    imgInput.src = "./img/pic1.png"
    darkBg.classList.add('active')
    popupForm.classList.add('active')
})

crossBtn.addEventListener('click', ()=>{
    darkBg.classList.remove('active')
    popupForm.classList.remove('active')
    form.reset()
})

uploadimg.onchange = function(){
    if(uploadimg.files[0].size < 1000000){   // 1MB = 1000000
        var fileReader = new FileReader()

        fileReader.onload = function(e){
            var imgUrl = e.target.result
            imgInput.src = imgUrl
        }

        fileReader.readAsDataURL(uploadimg.files[0])
    }

    else{
        alert("This file is too large!")
    }

}

function preLoadCalculations(){
    array = getData
    arrayLength = array.length
    maxIndex = arrayLength / tableSize

    if((arrayLength % tableSize) > 0){
        maxIndex++
    }
}



function displayIndexBtn(){
    preLoadCalculations()

    const pagination = document.querySelector('.pagination')

    pagination.innerHTML = ""

    pagination.innerHTML = '<button onclick="prev()" class="prev">Previous</button>'

    for(let i=1; i<=maxIndex; i++){
        pagination.innerHTML += '<button onclick= "paginationBtn('+i+')" index="'+i+'">'+i+'</button>'
    }

    pagination.innerHTML += '<button onclick="next()" class="next">Next</button>'

    highlightIndexBtn()
}


function highlightIndexBtn(){
    startIndex = ((currentIndex - 1) * tableSize) + 1
    endIndex = (startIndex + tableSize) - 1

    if(endIndex > arrayLength){
        endIndex = arrayLength
    }

    if(maxIndex >= 2){
        var nextBtn = document.querySelector(".next")
        nextBtn.classList.add("act")
    }


    entries.textContent = `Showing ${startIndex} to ${endIndex} of ${arrayLength} entries`

    var paginationBtns = document.querySelectorAll('.pagination button')
    paginationBtns.forEach(btn => {
        btn.classList.remove('active')
        if(btn.getAttribute('index') === currentIndex.toString()){
            btn.classList.add('active')
        }
    })


    showInfo()
}




function showInfo(){
    document.querySelectorAll(".employeeDetails").forEach(info => info.remove())

    var tab_start = startIndex - 1
    var tab_end = endIndex

    if(getData.length > 0){
        for(var i=tab_start; i<tab_end; i++){
            var staff = getData[i]


            if(staff){
                let createElement = `<tr class = "employeeDetails">
                <td>${staff.id}</td>
                <td><img src="${staff.picture}" alt="" width="40" height="40"></td>
                <td>${staff.fName + " " + staff.lName}</td>
                <td>${staff.ageVal}</td>
                <td>${staff.cityVal}</td>
                <td>${staff.positionVal}</td>
                <td>${staff.salaryVal}</td>
                <td>${staff.sDateVal}</td>
                <td>${staff.emailVal}</td>
                <td>${staff.phoneVal}</td>
                <td>
                    <button onclick="readInfo('${staff.picture}', '${staff.fName}', '${staff.lName}', '${staff.ageVal}', '${staff.cityVal}', '${staff.positionVal}', '${staff.salaryVal}', '${staff.sDateVal}', '${staff.emailVal}', '${staff.phoneVal}')"><i class="fa-regular fa-eye"></i></button>

                    <button onclick="editInfo('${staff.id}', '${staff.picture}', '${staff.fName}', '${staff.lName}', '${staff.ageVal}', '${staff.cityVal}', '${staff.positionVal}', '${staff.salaryVal}', '${staff.sDateVal}', '${staff.emailVal}', '${staff.phoneVal}')"><i class="fa-regular fa-pen-to-square"></i></button>


                    <button onclick = "deleteInfo(${staff.id})"><i class="fa-regular fa-trash-can"></i></button>
                </td>
            </tr>`

                userInfo.innerHTML += createElement
                table.style.minWidth = "1400px"
            }
        }
    }


    // else{
    //     userInfo.innerHTML = `<tr class="employeeDetails"><td class="empty" colspan="11" align="center">No data available in table</td></tr>`
    //     table.style.minWidth = "1400px"
    // }

    else {
        // Clear existing content
        userInfo.innerHTML = '';
    
        // Create loading spinner element
        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'loading-spinner';
    
        // Create loading text element
        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text';
        loadingText.innerHTML = 'Loading data...';
    
        // Create a new row for loading animation
        const loadingRow = document.createElement('tr');
        loadingRow.className = 'employeeDetails';
    
        // Append spinner and text to the row
        const loadingCell = document.createElement('td');
        loadingCell.className = 'empty';
        loadingCell.colSpan = '11'; // Adjust based on your table structure
        loadingCell.appendChild(loadingSpinner);
        loadingCell.appendChild(loadingText);
        
        loadingRow.appendChild(loadingCell);
        
        // Insert the loading row into the userInfo table
        userInfo.appendChild(loadingRow);
    
        // Optionally set minWidth of the table
        table.style.minWidth = "1400px";
    }
}

showInfo()


function readInfo(pic, fname, lname, Age, City, Position, Salary, SDate, Email, Phone){
    imgInput.src = pic
    fName.value = fname
    lName.value = lname
    age.value = Age
    city.value = City
    position.value = Position
    salary.value = Salary
    sDate.value = SDate
    email.value = Email
    phone.value = Phone

    darkBg.classList.add('active')
    popupForm.classList.add('active')
    popupFooter.style.display = "none"
    modalTitle.innerHTML = "Profile"
    formInputFields.forEach(input => {
        input.disabled = true
    })


    imgHolder.style.pointerEvents = "none"
}


function editInfo(id, pic, fname, lname, Age, City, Position, Salary, SDate, Email, Phone){
    isEdit = true
    editId = id

    // Find the index of the item to edit in the original data based on id
    const originalIndex = originalData.findIndex(item => item.id === id)

    // Update the original data
    originalData[originalIndex] = {
        id: id,
        picture: pic,
        fName: fname,
        lName: lname,
        ageVal: Age,
        cityVal: City,
        positionVal: Position,
        salaryVal: Salary,
        sDateVal: SDate,
        emailVal: Email,
        phoneVal: Phone
    }

    imgInput.src = pic
    fName.value = fname
    lName.value = lname
    age.value = Age
    city.value = City
    position.value = Position
    salary.value = Salary
    sDate.value = SDate
    email.value = Email
    phone.value = Phone


    darkBg.classList.add('active')
    popupForm.classList.add('active')
    popupFooter.style.display = "block"
    modalTitle.innerHTML = "Update the Form"
    submitBtn.innerHTML = "Update"
    formInputFields.forEach(input => {
        input.disabled = false
    })


    imgHolder.style.pointerEvents = "auto"
}

async function deleteInfo(id) {
    if(confirm("Are you sure you want to delete?")) {
        try {
            const response = await fetch(`https://67185641b910c6a6e02bb95e.mockapi.io/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
           
            // Reload data after delete action
            initializeData();
            preLoadCalculations();

            if(getData.length === 0){
                currentIndex = 1
                startIndex = 1
                endIndex = 0
            }
            else if(currentIndex > maxIndex){
                currentIndex = maxIndex
            }

            showInfo();
            highlightIndexBtn();
            displayIndexBtn();

            var nextBtn = document.querySelector('.next');
            var prevBtn = document.querySelector('.prev');

            // Update button states based on current index
            if(Math.floor(maxIndex) > currentIndex){
                nextBtn.classList.add("act");
            } else {
                nextBtn.classList.remove("act");
            }

            if(currentIndex > 1){
                prevBtn.classList.add('act');
            }

        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user. Please try again.');
        }
    }
}


form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Prepare the user information object
    const information = {
        id: Date.now(), // Will be ignored in POST since MockAPI auto-generates it
        picture: "./img/pic1.png",
        fName: fName.value,
        lName: lName.value,
        ageVal: age.value,
        cityVal: city.value,
        positionVal: position.value,
        salaryVal: salary.value,
        sDateVal: sDate.value,
        emailVal: email.value,
        phoneVal: phone.value
    };

    // Define the MockAPI endpoint
    const apiUrl = 'https://67185641b910c6a6e02bb95e.mockapi.io/users';

    // Check if we're editing an existing user or adding a new one
    if (!isEdit) {
        // Add a new user (POST request)
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(information),
        })
        .then(response => response.json())
        .then(data => {
            initializeData();
            getData = [...originalData];
            displayIndexBtn();
            showInfo();       
        })
        .catch(error => console.error('Error:', error));
    } else {
        // Update existing user (PUT request)
        fetch(`${apiUrl}/${editId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(information),
        })
        .then(response => response.json())
        .then(data => {
            initializeData();
            getData = [...originalData];
            displayIndexBtn();
            showInfo();  
        })
        .catch(error => console.error('Error:', error));
    }

    // Reset form, UI, and modal actions
    submitBtn.innerHTML = "Submit";
    modalTitle.innerHTML = "Fill the Form";
    darkBg.classList.remove('active');
    popupForm.classList.remove('active');
    form.reset();

    highlightIndexBtn();
    displayIndexBtn();
    showInfo();

    var nextBtn = document.querySelector(".next");
    var prevBtn = document.querySelector(".prev");
    if (Math.floor(maxIndex) > currentIndex) {
        nextBtn.classList.add("act");
    } else {
        nextBtn.classList.remove("act");
    }

    if (currentIndex > 1) {
        prevBtn.classList.add("act");
    }
});


function next(){
    var prevBtn = document.querySelector('.prev')
    var nextBtn = document.querySelector('.next')

    if(currentIndex <= maxIndex - 1){
        currentIndex++
        prevBtn.classList.add("act")

        highlightIndexBtn()
    }

    if(currentIndex > maxIndex - 1){
        nextBtn.classList.remove("act")
    }
}


function prev(){
    var prevBtn = document.querySelector('.prev')

    if(currentIndex > 1){
        currentIndex--
        prevBtn.classList.add("act")
        highlightIndexBtn()
    }

    if(currentIndex < 2){
        prevBtn.classList.remove("act")
    }
}


function paginationBtn(i){
    currentIndex = i

    var prevBtn = document.querySelector('.prev')
    var nextBtn = document.querySelector('.next')

    highlightIndexBtn()

    if(currentIndex > maxIndex - 1){
        nextBtn.classList.remove('act')
    }
    else{
        nextBtn.classList.add("act")
    }


    if(currentIndex > 1){
        prevBtn.classList.add("act")
    }

    if(currentIndex < 2){
        prevBtn.classList.remove("act")
    }
}



tabSize.addEventListener('change', ()=>{
    var selectedValue = parseInt(tabSize.value)
    tableSize = selectedValue
    currentIndex = 1
    startIndex = 1
    displayIndexBtn()
})



filterData.addEventListener("input", ()=> {
    const searchTerm = filterData.value.toLowerCase().trim()

    if(searchTerm !== ""){

        const filteredData = originalData.filter((item) => {
            const fullName = (item.fName + " " + item.lName).toLowerCase()
            const city = item.cityVal.toLowerCase()
            const position = item.positionVal.toLowerCase()

            return(
                fullName.includes(searchTerm) ||
                city.includes(searchTerm) ||
                position.includes(searchTerm)
            )
        })

        // Update the current data with filtered data
        getData = filteredData
    }

    else{
        initializeData();
        getData = originalData;
    }


    currentIndex = 1
    startIndex = 1
    displayIndexBtn()
})

let currentSort = {
    column: '',
    direction: 'default' 
};

function sortTable(column) {
    // Toggle sorting direction for the selected column
    if (currentSort.column === column) {
        // Cycle through 'asc' -> 'desc' -> 'default'
        if (currentSort.direction === 'default') {
            currentSort.direction = 'asc';
        } else if (currentSort.direction === 'asc') {
            currentSort.direction = 'desc';
        } else {
            currentSort.direction = 'default';
        }
    }else {
        currentSort.column = column;
        currentSort.direction = 'asc';
    }

    if (currentSort.direction === 'default') {
        initializeData();
        getData = [...originalData];
    } else {
        getData.sort((a, b) => {
            let valueA, valueB;

            switch (column) {
                case 'id':
                    valueA = parseInt(a.id);
                    valueB = parseInt(b.id);
                    break;
                case 'fullName':
                    valueA = (a.fName + " " + a.lName).toLowerCase();
                    valueB = (b.fName + " " + b.lName).toLowerCase();
                    break;
                case 'age':
                    valueA = parseInt(a.ageVal);
                    valueB = parseInt(b.ageVal);
                    break;
                case 'city':
                    valueA = a.cityVal.toLowerCase();
                    valueB = b.cityVal.toLowerCase();
                    break;
                case 'position':
                    valueA = a.positionVal.toLowerCase();
                    valueB = b.positionVal.toLowerCase();
                    break;
                case 'salary':
                    valueA = parseFloat(a.salaryVal);
                    valueB = parseFloat(b.salaryVal);
                    break;
                case 'sDate':
                    valueA = new Date(a.sDateVal);
                    valueB = new Date(b.sDateVal);
                    break;
                case 'email':
                    valueA = a.emailVal.toLowerCase();
                    valueB = b.emailVal.toLowerCase();
                    break;
                case 'phone':
                    valueA = a.phoneVal.toLowerCase();
                    valueB = b.phoneVal.toLowerCase();
                    break;
                default:
                    return 0;
            }

            if (currentSort.direction === 'asc') {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });
    }

    // Update table with sorted data or reset data
    showInfo();

    // Update sort icons based on direction
    updateSortIcons(column);
}

function updateSortIcons(column) {
    const sortIcons = document.querySelectorAll('.sort-icon');
    sortIcons.forEach(icon => icon.textContent = '↕️'); // Default icon for all

    // Update the icon for the currently sorted column
    const selectedIcon = document.getElementById(`${column}-sort`);
    if (currentSort.direction === 'asc') {
        selectedIcon.textContent = '↑'; // Ascending icon
    } else if (currentSort.direction === 'desc') {
        selectedIcon.textContent = '↓'; // Descending icon
    } else {
        selectedIcon.textContent = '↕️'; // Reset to default icon
    }
}

displayIndexBtn()