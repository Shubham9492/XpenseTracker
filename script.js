//get the ref of heading element
const headingEle = document.querySelector("#headingTotal");
//get the ref of inputAmount
const inputElement = document.querySelector("#inputAmount");
//get the ref of desc element
const inputDescEl = document.querySelector("#inputDesc");
//get the ref of desc table
const expenseTableEl = document.querySelector("#expenseTable");
const element = document.querySelector("#btnAddExpense");

//intialise value of Total Expense to 0
let totalExpense = 0;
//set the heading element to total expense
headingEle.textContent = totalExpense;
renderTotal(totalExpense);

let allExpense = [];
let savedArr = [];

function addExpenseToTotal() {
  const expenseItem = {};
  //read value from inputAmount
  const textAmount = inputElement.value;
  //convert it into no.
  const textDesc = inputDescEl.value;
  const expense = parseInt(textAmount, 10);

  totalExpense = totalExpense + expense;
  renderTotal(totalExpense);
  expenseItem.desc = textDesc;
  expenseItem.amount = expense;
  expenseItem.moment = new Date();
  allExpense.push(expenseItem);
  storeData(expenseItem, totalExpense);
  document.querySelector("#inputAmount").value = "";
  document.querySelector("#inputDesc").value = "";
  renderList(allExpense);
}

function storeData(expenseItem) {
  savedArr.push(expenseItem);
  localStorage.setItem("Saved", JSON.stringify(savedArr));
  localStorage.setItem("Total", totalExpense);
}

window.onload = function () {
  if (localStorage.getItem("Saved") === null) {
    console.log("Original State");
    return;
  }

  let arr = JSON.parse(localStorage.getItem("Saved"));
  arr.map((a) => {
    let dt = new Date(a.moment);
    a.moment = dt;
    savedArr.push(a);
  });

  let totExp = parseInt(localStorage.getItem("Total"));
  allExpense = savedArr;
  renderList(allExpense);
  renderTotal(totExp);
};

//listen to click event
element.addEventListener("click", addExpenseToTotal, false);

//get date
function getDateString(moment) {
  return moment.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

//delete item
function deleteItem(dateValue) {
  savedArr = [];
  allExpense = allExpense.filter((expense) => {
    if (expense.moment.valueOf() !== dateValue) {
      storeData(expense);
      return expense;
    }
  });
  if (savedArr.length === 0) {
    localStorage.removeItem("Saved");
    localStorage.removeItem("Total");
  }
  renderList(allExpense);
  newTotal(allExpense);
}

function newTotal(expenses) {
  let sum = 0;
  for (let i = 0; i < expenses.length; i++) {
    sum = sum + expenses[i].amount;
  }
  totalExpense = sum;
  localStorage.setItem("Total", sum);
  renderTotal(sum);
}

function renderTotal(totalExpense) {
  const someText = `Total : ${totalExpense}`;
  headingEle.textContent = someText;
}

//render function
function renderList(arrOfList) {
  const allExpenseHTML = arrOfList.map((expense) => createListItem(expense));
  const joinedAllExpenseHTML = allExpenseHTML.join("");
  expenseTableEl.innerHTML = joinedAllExpenseHTML;
}

//view layer
function createListItem({ desc, amount, moment }) {
  return `
       <li class="list-group-item d-flex justify-content-between">
      	<div class="d-flex flex-column">
      		${desc}
      		<small class="text-muted"> ${getDateString(moment)}</small>
      	</div>
      	<div>
      		<span class="px-5">
      			${amount}
      		</span>
      		<button
                type="button"
                class="btn btn-outline-danger btn-sm"
                onclick="deleteItem(${moment.valueOf()})"
                >
								<i class="fas fa-trash-alt"></i>
								</button>
      	</div>
      </li>
      `;
}
