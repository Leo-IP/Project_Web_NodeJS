function login(){
    console.log('Inside login')
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    $.ajax({
        type: 'POST',
        url: '/user/login',
        dataType: 'json',
        data:{
            email: email,
            password: password
        },
        success: function(data){
            console.log('success ' + data);
            document.getElementById('loginError').style.display = 'none';
            document.getElementById('loginBox').style.display = 'none';
            alert("You are successfully logged in");
            window.location.reload();
        },
        error: function(error){
            var res = JSON.stringify(error);
            var errorMsg = error.responseJSON.errors
            console.log('error ' + res)
            document.getElementById('loginError').style.display = "block"
            document.getElementById('loginError').innerHTML = errorMsg;
        }

    })
}

function registration(){
    console.log('Inside registration')

    var email = document.getElementById('regEmail').value;
    var password = document.getElementById('regPassword').value;
    var firstName = document.getElementById('regFirstName').value;
    var lastName = document.getElementById('regLastName').value;
    var phone = document.getElementById('regPhone').value;
    var birthday = document.getElementById('regBirthday').value;

    clearRegistrationError()

    console.log('email ' + email)
    console.log('password ' + password)
    console.log('firstName ' + firstName)
    console.log('lastName ' + lastName)
    console.log('phone ' + phone)
    console.log('birthday ' + birthday)

    $.ajax({
        type: 'POST',
        url: '/user/registration',
        dataType: 'json',
        data:{
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            birthday: birthday
        },
        success: function(data){
            console.log('success ' + data);
            // document.getElementById('myModal5').style.display = "none";
            document.getElementById('closeRegFormButton').click();
            alert("You are successfully registered");
        },
        error: function(error){
            var res = JSON.stringify(error);
            // var errorJSON = res.responseJSON.errors
            var errorObject = error.responseJSON.errors;
            var emailError = ''
            var passwordError = ''
            var firstNameError = ''
            var lastNameError = ''
            var phoneError = ''
            var birthdayError = ''

            if(Array.isArray(errorObject)){
                var errorJsonArray = errorObject;
                for (var i = 0; i < errorJsonArray.length; i++){
                    var jsonObject = errorJsonArray[i];
                    if(jsonObject.param === "email"){
                        emailError = jsonObject.msg;
                        document.getElementById('emailErrorMessage').innerHTML = emailError;
                        console.log(emailError);
                    }else if(jsonObject.param === "password"){
                        passwordError = jsonObject.msg;
                        document.getElementById('passwordErrorMessage').innerHTML = passwordError;
                        console.log(passwordError);
                    }else if(jsonObject.param === "phone"){
                        phoneError = jsonObject.msg;
                        document.getElementById('phoneErrorMessage').innerHTML = phoneError;
                        console.log(phoneError);
                    }else if(jsonObject.param === "firstName"){
                        firstNameError = jsonObject.msg;
                        document.getElementById('firstNameErrorMessage').innerHTML = firstNameError;
                        console.log(firstNameError);
                    }else if(jsonObject.param === "lastName"){
                        lastNameError = jsonObject.msg;
                        document.getElementById('lastNameErrorMessage').innerHTML = lastNameError;
                        console.log(lastNameError);
                    }else if(jsonObject.param === "birthday"){
                        birthdayError = jsonObject.msg;
                        document.getElementById('birthdayErrorMessage').innerHTML = birthdayError;
                        console.log(birthdayError);
                    }
                }
            }else{
                var errorMsg = errorObject;
                document.getElementById('emailErrorMessage').innerHTML = errorMsg;
                console.log(errorMsg);
            }

            console.log('error ' + res)
            // document.getElementById('loginError').style.display = "block"
        }

    })
}

function clearRegistrationForm(){
    console.log('Inside clearRegistrationForm')
    document.getElementById('regEmail').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('regFirstName').value = '';
    document.getElementById('regLastName').value = '';
    document.getElementById('regPhone').value = '';
    document.getElementById('regBirthday').value = '';

    document.getElementById('firstNameErrorMessage').innerHTML = '';
    document.getElementById('lastNameErrorMessage').innerHTML = '';
    document.getElementById('birthdayErrorMessage').innerHTML = '';
    document.getElementById('phoneErrorMessage').innerHTML = '';
    document.getElementById('emailErrorMessage').innerHTML = '';
    document.getElementById('passwordErrorMessage').innerHTML = '';
}

function clearRegistrationError(){
    document.getElementById('firstNameErrorMessage').innerHTML = '';
    document.getElementById('lastNameErrorMessage').innerHTML = '';
    document.getElementById('birthdayErrorMessage').innerHTML = '';
    document.getElementById('phoneErrorMessage').innerHTML = '';
    document.getElementById('emailErrorMessage').innerHTML = '';
    document.getElementById('passwordErrorMessage').innerHTML = '';
}

function callingDatePicker(){
    var dateToday = new Date();
    var yrRange = (dateToday.getFullYear() - 108) + ':' + (dateToday.getFullYear() - 9);
    console.log(yrRange);

    $( function() {
        $( "#regBirthday" ).datepicker({
            dateFormat: 'yy-mm-dd',
            showButtonPanel: true,
            yearRange: yrRange,
            changeMonth: true,
            changeYear: true,
            minDate: new Date(1911, 1-1, 1),
            maxDate: new Date((dateToday.getFullYear() - 9), 11, 31)
        }).focus();
    });
}

function refund(orderId){

    $.ajax({
        type: 'POST',
        url: '/user/refund',
        dataType: 'json',
        data:{
            orderId : orderId,
        },
        success: function(data){
            var rowId = 'purchaseHistory' + orderId
            var row = document.getElementById(rowId);
            row.parentNode.removeChild(row)
            alert("You have successfully refunded the order! "+ rowId);

        },
        error: function(error){
            var errorMsg = error.responseJSON.errors;
            alert(errorMsg);
        }

    })
}

function redeemCredits(){
    console.log('Inside registration')

    var code = document.getElementById('credits-code').value;

    $.ajax({
        type: 'POST',
        url: '/user/redeem-credits',
        dataType: 'json',
        data:{
            code : code,
        },
        success: function(data){
            console.log('success ' + data);
            document.getElementById('redeemErrorMessage').innerHTML = '';
            var redeemCreditsValue = parseInt(data.amounts);
            var orginalCreditsValue = parseInt(document.getElementById('credits-value').innerHTML);
            var latestCreditsValue = orginalCreditsValue + redeemCreditsValue;
            document.getElementById('credits-code').value = '';
            document.getElementById('credits-value').innerHTML = latestCreditsValue.toString();
        },
        error: function(error){
            var errorMsg = error.responseJSON.errors;

            document.getElementById('redeemErrorMessage').innerHTML = errorMsg;
        }

    })
}

function logout(){
    console.log('Inside logout')
    $.ajax({
        type: 'GET',
        url: '/user/logout',
        dataType: 'json',
        success: function(data){
            console.log(data)
            alert("You are successfully logged out");
            localStorage.removeItem('cart');
            window.location.reload();
        },
        error: function(error){
            var errorMsg = error.responseJSON.errors;
            console.log(errorMsg)
            alert("You are not logged in");
            window.location.reload();
        }

    })
}
