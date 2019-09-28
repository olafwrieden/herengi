function newElement() {
    var li = document.createElement("li");
    var inputValue = document.getElementById("itemInput").value;
    var inputPrice = document.getElementById("inputPrice").value;
    console.log(inputPrice)
    inputValue = inputValue + ": " + "$" + inputPrice;

    var accountFunds = document.getElementById("funds");
    let funds = accountFunds.getAttribute('data-funds');
    console.log(funds)

    accountFundsUpdate = (parseFloat(funds) - parseFloat(inputPrice)).toFixed(2);
    console.log(accountFundsUpdate);
    document.getElementById("funds").innerHTML = "$"+accountFundsUpdate;
    document.getElementById("funds").setAttribute("data-funds", accountFundsUpdate)

    //document.getElementById("funds").innerHTML = accountFunds - inputPrice;

    var t = document.createTextNode(inputValue);
    li.appendChild(t);
    if (inputValue === '') {
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

var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}


