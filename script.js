let inputWhere = null;
let inputHowMuch = null;
let varWhere = "";
let varHowMuch = "";
let buttonAdd = null;

let content = null;
let container = null;

let finalcost = 0;

let input1 = null;
let input2 = null;
let input3 = null;

let indexCost = null;
let indexCost2 = null;
let count = 0;
let outlay = [];

window.onload = async () => {
  inputWhere = document.getElementById("where-spend");
  inputHowMuch = document.getElementById("how-much");
  buttonAdd = document.getElementById("add-spend");

  const response = await fetch("http://localhost:8080/get", {
    method: "GET",
  });

  const result = await response.json();
  outlay = result.costs;

  inputWhere.addEventListener("change", writeWhere);
  inputHowMuch.addEventListener("change", writeHowMuch);
  buttonAdd.addEventListener("click", addCost);
  render();
};

const writeWhere = (event) => {
  varWhere = event.target.value;
};

const writeHowMuch = (event) => {
  varHowMuch = event.target.value;
};

const addCost = async (event) => {
  if (varWhere.length != 0 && varHowMuch.length != 0) {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();
    today = dd + "." + mm + "." + yyyy;

    const response = await fetch("http://localhost:8080/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        where: varWhere,
        date: today,
        howMuch: varHowMuch,
      }),
    });
    const result = await response.json();
    outlay = result.costs;

    inputWhere.value = "";
    inputHowMuch.value = "";
    varWhere = "";
    varHowMuch = "";
    render();
  } else {
    alert("Введённые значения не корректны");
  }
};

const render = () => {
  finalcost = 0;
  // let counter = 0;
  content = document.getElementById("list-spend");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  outlay.map((item, index) => {
    container = document.createElement("div");
    container.id = `spend ${index}`;

    const num = document.createElement("p");
    num.innerText = `${index+1})`;

    const textWhere = document.createElement("p");
    textWhere.innerText = item.where;

    const textDate = document.createElement("p");
    textDate.innerText = item.date;

    const textHowMuch = document.createElement("p");
    textHowMuch.innerText = item.howMuch;

    const textRubl = document.createElement("p");
    textRubl.innerText = "р.";

    const imgDel = document.createElement("img");
    imgDel.src = "icons8-удалить-64.png";
    imgDel.onclick = function () {
      funcDel(index);
    };

    const imgEdit = document.createElement("img");
    imgEdit.src = "icons8-редактировать-64.png";

    const div1 = document.createElement("div");
    const div2 = document.createElement("div");
    const div3 = document.createElement("div");

    input1 = document.createElement("input");
    input2 = document.createElement("input");
    input3 = document.createElement("input");
    input1.type = "text";
    input2.type = "text";
    input3.type = "number";
    input1.value = item.where;
    input2.value = item.date;
    input3.value = item.howMuch;

    div1.appendChild(num);

    if (index === indexCost && (indexCost != indexCost2 || count === 2)) {
      indexCost2 = indexCost;
      indexCost = null;
      div1.appendChild(input1);
      div1.appendChild(input2);
      div2.appendChild(input3);
      count = 0;
      input1.addEventListener("change", (e) => funcinput1(e, index));
      input2.addEventListener("change", (e) => funcinput2(e, index));
      input3.addEventListener("change", (e) => funcinput3(e, index));
    } else {
      div1.appendChild(textWhere);
      div1.appendChild(textDate);
      div2.appendChild(textHowMuch);
    }

    div2.appendChild(textRubl);

    div3.appendChild(imgEdit);
    div3.appendChild(imgDel);

    container.appendChild(div1);
    container.appendChild(div2);
    container.appendChild(div3);
    content.appendChild(container);
    imgEdit.addEventListener("click", (e) => funcEdit(e, index));
  });
  outlay.forEach((item) => {
    finalcost += +item.howMuch;
  });
  const textFinalCost = document.getElementById("cost");
  textFinalCost.innerText = `${finalcost} р.`;
};

funcDel = async (index) => {
  const response = await fetch(
    `http://localhost:8080/del?id=${outlay[index]._id}`,
    {
      method: "DELETE",
    }
  );
  const result = await response.json();
  outlay = result.costs;
  render();
};

const funcEdit = (event, index) => {
  indexCost = index;
  count++;
  render();
};
funcinput1 = async (event, index) => {
  let { _id } = outlay[index];
  if (event.target.value.length != 0) {
    const response = await fetch("http://localhost:8080/patch", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        _id,
        where: event.target.value,
      }),
    });
    const result = await response.json();
    outlay = result.costs;
  } else {
    alert("Изменённые значения не корректны");
  }
};
funcinput2 = async (event, index) => {
  let { _id } = outlay[index];
  if (event.target.value.length != 0) {
    const response = await fetch("http://localhost:8080/patch", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        _id,
        date: event.target.value,
      }),
    });
    const result = await response.json();
    outlay = result.costs;
  } else {
    alert("Изменённые значения не корректны");
  }
};
funcinput3 = async (event, index) => {
  let { _id } = outlay[index];
  if (event.target.value.length != 0) {
    const response = await fetch("http://localhost:8080/patch", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        _id,
        howMuch: event.target.value,
      }),
    });
    const result = await response.json();
    outlay = result.costs;
  } else {
    alert("Изменённые значения не корректны");
  }
};
