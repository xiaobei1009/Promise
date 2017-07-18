//var promiseList = [];
//var promiseIndex = 0;
(function(window, undefined){
	var PromiseState = {
		Pending : 0,
		Resolved : 1,
		Rejected : 2
	}
	var MyPromise = function (resolver) {
		//
		//promiseList.push(this);
		//this.promiseIndex = promiseIndex++;
		//
		
		var promise = this;
		promise.prevPromise = null;
		promise.nextPromiseStack = [];
		promise.nextPendingPromiseStack = [];
		promise.changeState(PromiseState.Pending);
		promise.value = null;
		promise.reason = null;
		promise.onFulFilledCallbackStack = [];
		
		var onFulFilledCallback = null;
		var dealWithFulFilledCallbackStack = function(val) {
			var onFulFilledCallbackRet = null;
			while (onFulFilledCallback = promise.onFulFilledCallbackStack.shift()) {
				onFulFilledCallbackRet = onFulFilledCallback(promise.value);
				if (onFulFilledCallbackRet instanceof MyPromise) {
					onFulFilledCallbackRet.then(function(val) {
						promise.nextPendingPromiseStack.shift().resolve(val);
					});
				} else {
					promise.nextPendingPromiseStack.shift().resolve(val);
				}
			}
		};
		
		promise.resolve = function (val) {
			setTimeout(function() {
				promise.value = val;
				dealWithFulFilledCallbackStack(val);
				promise.changeState(PromiseState.Resolved);
				//console.log("[promise " + promise.promiseIndex + "] resolved");
			});
		}
		resolver(promise.resolve);
	};
	MyPromise.prototype.changeState = function(state) {
		var promise = this;
		if (promise.state == null)
			promise.state = PromiseState.Pending;
		if (promise.state != PromiseState.Pending)
			return;
		switch (state) {
			case PromiseState.Pending :
				promise.stateDesc = "Pending";
				break;
			case PromiseState.Resolved : 
				promise.stateDesc = "Resolved";
				break;
			case PromiseState.Rejected : 
				promise.stateDesc = "Rejected";
				break;
		}
		promise.state = state;
	};
	MyPromise.prototype.then = function(onFulFilledCallback) {
		debugger;
		var promise = this;
		var onFulFilledCallbackRet = null;
		var resolver = function(resolve) {
			switch (promise.state) {
				case PromiseState.Pending : 
					promise.onFulFilledCallbackStack.push(onFulFilledCallback);
					break;
				case PromiseState.Resolved : 
					debugger;
					onFulFilledCallbackRet = onFulFilledCallback(promise.value);
					if (onFulFilledCallbackRet instanceof MyPromise) {
						onFulFilledCallbackRet.then(function(val) {
							resolve(val);
						});
					} else {
						resolve(promise.value);
					}
					break;
				case PromiseState.Rejected : break;
			}
		};
		var newPromise = new MyPromise(resolver);
		newPromise.prevPromise = promise;
		promise.nextPromiseStack.push(newPromise);
		promise.nextPendingPromiseStack.push(newPromise);
		return newPromise;
	};
	window.MyPromise = MyPromise;
}(window));

var sw = "0";
var step1 = function(resolve, reject) {
	setTimeout(function(){
		console.log("step1");
		if (sw == "0") {
			resolve("resolve step1");
		} else {
			reject("reject step1");
		}
	}, 1000);	
}
var step2 = function(resolve, reject) {
	setTimeout(function(){
		console.log("step2");
		if (sw == "0") {
			resolve("resolve step2");
		} else {
			reject("reject step2");
		}
	}, 1000);	
}
var step3 = function(resolve, reject) {
	setTimeout(function(){
		console.log("step3");
		if (sw == "0") {
			resolve("resolve step3");
		} else {
			reject("reject step3");
		}
	}, 1000);	
}
var step1 = function(resolve, reject) {
	console.log("step1");
	if (sw == "0") {
		resolve("resolve step1");
	} else {
		reject("reject step1");
	}
}
var step2 = function(resolve, reject) {
	console.log("step2");
	if (sw == "0") {
		resolve("resolve step2");
	} else {
		reject("reject step2");
	}
}

var step3 = function(resolve, reject) {
	console.log("step3");
	if (sw == "0") {
		resolve("resolve step3");
	} else {
		reject("reject step3");
	}
}
/*
var myPromise = new MyPromise(step1).then(function (val) {
		console.log(val);
		var promise = new MyPromise(step2);
		promise.markXXX = 1;
		return promise;
	}).then(function (val) {
		console.log(val)
	});
*/
var myPromise = new MyPromise(step1).then(function (val) {
		console.log(val);
		return new MyPromise(step2);
	}).then(function (val) {
		console.log(val);
		return new MyPromise(step3);
	}).then(function (val) {
		console.log(val);
	})
myPromise.then(function(val){
	console.log(val);
});
