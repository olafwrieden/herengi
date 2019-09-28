function selectAccount(accountID) {
  console.log(accountID);
  //fetch(`http://localhost:5000/data?accountId=${accountID}`)
  fetch(`http://localhost:5000/accounts/${accountID}`)
    .then(function(response) {
      if (response.status !== 200) {
        console.log(response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
        console.log(data);
      });
    })
    .catch(function(err) {
      console.log("Fetch Error :-S", err);
    });
}
