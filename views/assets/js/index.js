function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("itemInput").value;
  var inputPrice = document.getElementById("inputPrice").value;
  li.setAttribute("data-amount", inputPrice);
  li.setAttribute("style", "display:inline;");

  var priceSpan = document.createElement("span");
  li.setAttribute("style", "width:100%;");
  priceSpan.innerHTML = `<span class="price">$${inputPrice}</span>`;
  li.appendChild(priceSpan);
  li.addEventListener("click", function(ev) {
    let amount = ev.target.getAttribute("data-amount");
    console.log(ev.target.tagName);
    ev.target.classList.toggle("checked");

    if (ev.target.classList.contains("checked")) {
      var accountFunds = document.getElementById("funds");
      let funds = accountFunds.getAttribute("data-funds");

      let accountFundsUpdate = (parseFloat(funds) - parseFloat(amount)).toFixed(
        2
      );
      console.log("acc", accountFundsUpdate);
      document.getElementById("funds").innerHTML = "$" + accountFundsUpdate;
      document
        .getElementById("funds")
        .setAttribute("data-funds", accountFundsUpdate);
    } else {
      var accountFunds = document.getElementById("funds");
      let funds = accountFunds.getAttribute("data-funds");

      let accountFundsUpdate = (parseFloat(funds) + parseFloat(amount)).toFixed(
        2
      );
      console.log("acc", accountFundsUpdate);
      document.getElementById("funds").innerHTML = "$" + accountFundsUpdate;
      document
        .getElementById("funds")
        .setAttribute("data-funds", accountFundsUpdate);
    }

    // addToBuy(amount);
  });

  // inputValue = inputValue + ": " + "$" + inputPrice;

  // var accountFunds = document.getElementById("funds");
  // let funds = accountFunds.getAttribute("data-funds");

  // accountFundsUpdate = (parseFloat(funds) - parseFloat(inputPrice)).toFixed(2);

  // document.getElementById("funds").innerHTML = "$" + accountFundsUpdate;
  // document
  //   .getElementById("funds")
  //   .setAttribute("data-funds", accountFundsUpdate);

  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === "") {
    alert("You must write something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);
}

// var myNodelist = document.getElementsByTagName("LI");
// var i;
// for (i = 0; i < myNodelist.length; i++) {
//   console.log('called?')
//   var span = document.createElement("SPAN");
//   var txt = document.createTextNode("\u00D7");
//   span.className = "close";
//   span.appendChild(txt);
//   myNodelist[i].appendChild(span);
// }

// // Click on a close button to hide the current list item
// var close = document.getElementsByClassName("close");
// var i;
// for (i = 0; i < close.length; i++) {
//   close[i].onclick = function() {
//     var div = this.parentElement;
//     div.style.display = "none";
//   };
// }

const addToBuy = e => {
  console.log(e);
  var accountFunds = document.getElementById("funds");
  let funds = accountFunds.getAttribute("data-funds");

  accountFundsUpdate = (parseFloat(funds) - parseFloat(e)).toFixed(2);

  document.getElementById("funds").innerHTML = "$" + accountFundsUpdate;
  document
    .getElementById("funds")
    .setAttribute("data-funds", accountFundsUpdate);
};
