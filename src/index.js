(async function () {
    const data = await fetch('./src/data.json')
    const formattedData = await data.json();

    let employees = formattedData;
    let selectedEmployeeId = employees[0].id;
    let selectedEmployee = employees[0];

    const employeeList = document.querySelector('.employees__names--list');
    const employeeInfo = document.querySelector('.employess_names--info');

    const createEmployeeBtn = document.querySelector('.create_employee');
    const addEmployeeModal = document.querySelector('.addEmployee');
    const addEmployeeForm = document.querySelector('.addEmployee_create');

    createEmployeeBtn.addEventListener('click', (e) => {
        addEmployeeModal.style.display = "flex"
    })

    addEmployeeModal.addEventListener('click', (e) => {
        if (e.target.className === "addEmployee") {
            addEmployeeModal.style.display = "none"
        }
    })

    const dobInput = document.querySelector(".create_employee--dob");
    console.log(dobInput);
    dobInput.max = `${new Date().getFullYear() - 18}-${new Date().toISOString().slice(5, 10)}`;
    // Add employee
    addEmployeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(addEmployeeForm);
        const values = [...formData.entries()];
        let empData = {};
        values.forEach((val) => {
            empData[val[0]] = val[1];
        })
        empData.id = employees[employees.length -1].id + 1;
        empData.age = new Date().getFullYear() - parseInt(empData.dob.slice(0, 4), 10);
        empData.image_url = empData.imageURL || "https://via.placeholder.com/150";
        employees.push(empData);
        addEmployeeForm.reset();
        addEmployeeModal.style.display = "none"
        renderEmployees();
    })

    // Select employee
    employeeList.addEventListener('click', (e) => {
        if (e.target.tagName === 'SPAN' &&  selectedEmployeeId !== e.target.id) {
            selectedEmployeeId = e.target.id;
            selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
            renderEmployees();
            singleEmployee();
        }
        if (e.target.tagName === 'I') {
            employees = employees.filter((emp) => (
            String(emp.id) !== e.target.parentNode.id
            ));

            if (String(selectedEmployeeId) === e.target.parentNode.id) {
                selectedEmployeeId = employees[0].id || -1;
                selectedEmployee = employees[0] || {};
                singleEmployee();
            }
            renderEmployees();
        }
    })

    const renderEmployees = () => {
        employeeList.innerHTML = "";
        employees.forEach((emp) => {
            const employee = document.createElement("span");
            employee.classList.add("employees__names--item");

            if (parseInt(selectedEmployeeId, 10) === emp.id) {
                employee.classList.add("selected");
                selectedEmployee = emp;
            }

            employee.setAttribute("id", emp.id);
            employee.innerHTML = `${emp.first_name} ${emp.last_name} <i class="removeEmployee">❌<i>`

            employeeList.append(employee);
        })
    }

    const singleEmployee = () => {
        employeeInfo.innerHTML = `
        <img src="${selectedEmployee.image_url}" />
        <h2>${selectedEmployee.first_name} ${selectedEmployee.last_name}</h2>
        <h3>${selectedEmployee.designation}</h3>
        <div>Address: ${selectedEmployee.address}</div>
        <div>DOB: ${selectedEmployee.dob}</div>
        `;
    }

    renderEmployees();
    singleEmployee();
})()