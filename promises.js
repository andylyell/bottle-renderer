const p1 = new Promise(function(resolve, reject) {
    setTimeout(function(){
        if(true) {
            resolve('worked');
        } else {
            reject('broke');
        }
    },3000)
});

p1
    .then(function(result){
        console.log(result);
    })
    .catch(function(err){
        console.error(err);
    });


