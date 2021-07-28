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

let changeOne = {
  index: null,
  first: false,
  second: false,
  third: false,
};

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
    num.innerText = `${index + 1})`;

    const textWhere = document.createElement("p");
    textWhere.innerText = item.where;
    textWhere.addEventListener("dblclick", (e) => funcWhere(e, index));

    const textDate = document.createElement("p");
    textDate.innerText = item.date;
    textDate.addEventListener("dblclick", (e) => funcDate(e, index));

    const textHowMuch = document.createElement("p");
    textHowMuch.innerText = item.howMuch;
    textHowMuch.addEventListener("dblclick", (e) => funcHowMuch(e, index));

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
    const div4 = document.createElement("div");

    input1 = document.createElement("input");
    input2 = document.createElement("input");
    input3 = document.createElement("input");
    input1.autofocus=true;
    input2.autofocus=true;
    input3.autofocus=true;
    input1.type = "text";
    input2.type = "text";
    input3.type = "number";
    input1.value = item.where;
    input2.value = item.date;
    input3.value = item.howMuch;
    

    div1.appendChild(num);

    if (index === changeOne.index) {
      changeOne.index = null;
      if (changeOne.first) {
        changeOne.first = !changeOne.first;
        input1.selectionStart = input1.value.length;
        div1.appendChild(input1);
        input1.addEventListener("blur", (e) => funcinput1(e, index));
      } else {
        div1.appendChild(textWhere);
      }

      if (changeOne.second) {
        changeOne.second = !changeOne.second;
        input2.selectionStart = input2.value.length;
        div2.appendChild(input2);
        input2.addEventListener("blur", (e) => funcinput2(e, index));
      } else {
        div2.appendChild(textDate);
      }
      if (changeOne.third) {
        changeOne.third = !changeOne.third;
        input3.selectionStart = input3.value.length;
        div3.appendChild(input3);
        input3.addEventListener("blur", (e) => funcinput3(e, index));
      } else {
        div3.appendChild(textHowMuch);
      }
    } else {
      div1.appendChild(textWhere);
      div2.appendChild(textDate);
      div3.appendChild(textHowMuch);
    }

    // if (index === indexCost && (indexCost != indexCost2 || count === 2)) {
    //   indexCost2 = indexCost;
    //   indexCost = null;
    //   div1.appendChild(input1);
    //   div2.appendChild(input2);
    //   div3.appendChild(input3);
    //   count = 0;
    //   input1.addEventListener("change", (e) => funcinput1(e, index));
    //   input2.addEventListener("change", (e) => funcinput2(e, index));
    //   input3.addEventListener("change", (e) => funcinput3(e, index));
    // } else {
    //   div1.appendChild(textWhere);
    //   div2.appendChild(textDate);
    //   div3.appendChild(textHowMuch);
    // }

    div3.appendChild(textRubl);

    div4.appendChild(imgEdit);
    div4.appendChild(imgDel);

    container.appendChild(div1);
    container.appendChild(div2);
    container.appendChild(div3);
    container.appendChild(div4);
    content.appendChild(container);
    // imgEdit.addEventListener("click", (e) => funcEdit(e, index));
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

funcWhere = (event, index) => {
  changeOne.index = index;
  changeOne.first = !changeOne.first;
  console.log(index);
  render();
};

funcDate = (event, index) => {
  changeOne.index = index;
  changeOne.second = !changeOne.second;
  console.log(index);
  render();
};

funcHowMuch = (event, index) => {
  changeOne.index = index;
  changeOne.third = !changeOne.third;
  console.log(index);
  render();
};

funcinput1 = async (event, index) => {
  let { _id } = outlay[index];

  console.log(event.target.value.length);
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
  render();
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
  render();
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
  render();
};
