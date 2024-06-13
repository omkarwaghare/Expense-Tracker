const inputDescription = document.querySelector("#description");
const amount = document.querySelector("#amount");
const spend = document.querySelector("#spend");
const receive = document.querySelector("#receive");
const balance = document.querySelector("#balance-amount-data");
const expense = document.querySelector("#expense-amount-data");
const tabledata = document.querySelector("#table-data");



let data = JSON.parse(localStorage.getItem("expense-data")) ?? [];
let spendMoney = 0;
let receiveMoney = 0;

let date = new Date();

const getRandomString = () => {
    let choices = "abcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    for (i = 0; i < 10; i++) {
        randomString += choices[Math.round(Math.random() * 35)];
    }

    return randomString;

}


const getValues = () => {
    return [inputDescription.value, amount.value, getRandomString()]
}



const addTransaction = (addInput, addAmount, randomString) => {


    inputDescription.value = "";
    amount.value = "";

    let pushDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    let pushData = {
        input: addInput,
        amount: addAmount,
        date: pushDate,
        randomKey: randomString
    }

    data.push(pushData);
    localStorage.setItem("expense-data", JSON.stringify(data));
    addRow(addInput, addAmount, pushDate, randomString);

    refreshBalance();

}



const refreshBalance = () => {
    balance.textContent = receiveMoney;
    expense.textContent = spendMoney;
}



const moneyReceive = () => {
    let [addInput, addAmount, randomString] = getValues();

    if (!addInput || !addAmount) {
        alert("Fill all information");
        return;
    }

    receiveMoney += (addAmount*1);
    addTransaction(addInput, (addAmount * 1), randomString);


}


const moneySpent = () => {
    let [addInput, addAmount, randomString] = getValues();

    if (!addInput || !addAmount) {
        alert("Fill all information");
        return;
    }

    spendMoney += (addAmount * -1);
    addTransaction(addInput, (addAmount * -1), randomString);
}



const addRow = (desc, amount, date, randomKey) => {

    let newRow = document.createElement("tr");
    newRow.innerHTML =  `
        <td>${desc}</td>
        <td>${amount}</td>
        <td>${date}</td>
        <td>
            <input type="hidden" name="randomKey" value="${randomKey}">
            <button class="remove-button">X</button>
        </td>
    `;
    tabledata.appendChild(newRow);
}




const removeElement = (e) => {

    if (e.target.classList.contains("remove-button")) {

        let randomKey = e.target.previousSibling.value;
        
        data = data.filter((element) => {
            if (element.randomKey != randomKey) {
                return element;
            }
        });

        localStorage.setItem("expense-data", JSON.stringify(data));
        let tdOfremove = e.target.parentNode;
        let amount = tdOfremove.previousSibling.previousSibling.innerHTML;
        
        if((amount*1 >= 0)) {
            receiveMoney -= (amount*1)
        }else {
            spendMoney += (amount*-1)
        }

        tabledata.removeChild(tdOfremove.parentNode);
        refreshBalance();
    }
}

const showData = () => {
    for (let tag of data) {
        addRow(tag.input, tag.amount, tag.date, tag.randomKey);

        if(tag.amount>=0) {
            receiveMoney += tag.amount;
        }else {
            spendMoney += tag.amount;
        }

    }
}


showData();
refreshBalance();


console.log(receiveMoney,spendMoney);
tabledata.addEventListener("click", (e) => {
    removeElement(e);
})


spend.addEventListener("click", (e) => {
    e.preventDefault();
    moneySpent();
})

receive.addEventListener("click", (e) => {
    e.preventDefault();
    moneyReceive();
})