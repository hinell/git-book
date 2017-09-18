/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "970eb5f91b4fe330a842"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(1)(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "@media print {\n  *,\n  *::before,\n  *::after {\n    text-shadow: none !important;\n    box-shadow: none !important; }\n  a,\n  a:visited {\n    text-decoration: underline; }\n  abbr[title]::after {\n    content: \" (\" attr(title) \")\"; }\n  pre {\n    white-space: pre-wrap !important; }\n  pre,\n  blockquote {\n    border: 1px solid #999;\n    page-break-inside: avoid; }\n  thead {\n    display: table-header-group; }\n  tr,\n  img {\n    page-break-inside: avoid; }\n  p,\n  h2,\n  h3 {\n    orphans: 3;\n    widows: 3; }\n  h2,\n  h3 {\n    page-break-after: avoid; }\n  .navbar {\n    display: none; }\n  .badge {\n    border: 1px solid #000; }\n  .table {\n    border-collapse: collapse !important; }\n    .table td,\n    .table th {\n      background-color: #fff !important; }\n  .table-bordered th,\n  .table-bordered td {\n    border: 1px solid #ddd !important; } }\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box; }\n\nhtml {\n  font-family: sans-serif;\n  line-height: 1.15;\n  -webkit-text-size-adjust: 100%;\n  -ms-text-size-adjust: 100%;\n  -ms-overflow-style: scrollbar;\n  -webkit-tap-highlight-color: transparent; }\n\n@-ms-viewport {\n  width: device-width; }\n\narticle, aside, dialog, figcaption, figure, footer, header, hgroup, main, nav, section {\n  display: block; }\n\nbody {\n  margin: 0;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-size: 1rem;\n  font-weight: normal;\n  line-height: 1.5;\n  color: #212529;\n  text-align: left;\n  background-color: #fff; }\n\n[tabindex=\"-1\"]:focus {\n  outline: none !important; }\n\nhr {\n  box-sizing: content-box;\n  height: 0;\n  overflow: visible; }\n\nh1, h2, h3, h4, h5, h6 {\n  margin-top: 0;\n  margin-bottom: .5rem; }\n\np {\n  margin-top: 0;\n  margin-bottom: 1rem; }\n\nabbr[title],\nabbr[data-original-title] {\n  text-decoration: underline;\n  text-decoration: underline dotted;\n  cursor: help;\n  border-bottom: 0; }\n\naddress {\n  margin-bottom: 1rem;\n  font-style: normal;\n  line-height: inherit; }\n\nol,\nul,\ndl {\n  margin-top: 0;\n  margin-bottom: 1rem; }\n\nol ol,\nul ul,\nol ul,\nul ol {\n  margin-bottom: 0; }\n\ndt {\n  font-weight: bold; }\n\ndd {\n  margin-bottom: .5rem;\n  margin-left: 0; }\n\nblockquote {\n  margin: 0 0 1rem; }\n\ndfn {\n  font-style: italic; }\n\nb,\nstrong {\n  font-weight: bolder; }\n\nsmall {\n  font-size: 80%; }\n\nsub,\nsup {\n  position: relative;\n  font-size: 75%;\n  line-height: 0;\n  vertical-align: baseline; }\n\nsub {\n  bottom: -.25em; }\n\nsup {\n  top: -.5em; }\n\na {\n  color: #007bff;\n  text-decoration: none;\n  background-color: transparent;\n  -webkit-text-decoration-skip: objects; }\n  a:hover {\n    color: #0056b3;\n    text-decoration: underline; }\n\na:not([href]):not([tabindex]) {\n  color: inherit;\n  text-decoration: none; }\n  a:not([href]):not([tabindex]):focus, a:not([href]):not([tabindex]):hover {\n    color: inherit;\n    text-decoration: none; }\n  a:not([href]):not([tabindex]):focus {\n    outline: 0; }\n\npre,\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em; }\n\npre {\n  margin-top: 0;\n  margin-bottom: 1rem;\n  overflow: auto; }\n\nfigure {\n  margin: 0 0 1rem; }\n\nimg {\n  vertical-align: middle;\n  border-style: none; }\n\nsvg:not(:root) {\n  overflow: hidden; }\n\na,\narea,\nbutton,\n[role=\"button\"],\ninput,\nlabel,\nselect,\nsummary,\ntextarea {\n  touch-action: manipulation; }\n\ntable {\n  border-collapse: collapse; }\n\ncaption {\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n  color: #868e96;\n  text-align: left;\n  caption-side: bottom; }\n\nth {\n  text-align: inherit; }\n\nlabel {\n  display: inline-block;\n  margin-bottom: .5rem; }\n\nbutton:focus {\n  outline: 1px dotted;\n  outline: 5px auto -webkit-focus-ring-color; }\n\ninput,\nbutton,\nselect,\noptgroup,\ntextarea {\n  margin: 0;\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit; }\n\nbutton,\ninput {\n  overflow: visible; }\n\nbutton,\nselect {\n  text-transform: none; }\n\nbutton,\nhtml [type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; }\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  padding: 0;\n  border-style: none; }\n\ninput[type=\"radio\"],\ninput[type=\"checkbox\"] {\n  box-sizing: border-box;\n  padding: 0; }\n\ninput[type=\"date\"],\ninput[type=\"time\"],\ninput[type=\"datetime-local\"],\ninput[type=\"month\"] {\n  -webkit-appearance: listbox; }\n\ntextarea {\n  overflow: auto;\n  resize: vertical; }\n\nfieldset {\n  min-width: 0;\n  padding: 0;\n  margin: 0;\n  border: 0; }\n\nlegend {\n  display: block;\n  width: 100%;\n  max-width: 100%;\n  padding: 0;\n  margin-bottom: .5rem;\n  font-size: 1.5rem;\n  line-height: inherit;\n  color: inherit;\n  white-space: normal; }\n\nprogress {\n  vertical-align: baseline; }\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\n[type=\"search\"] {\n  outline-offset: -2px;\n  -webkit-appearance: none; }\n\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\n::-webkit-file-upload-button {\n  font: inherit;\n  -webkit-appearance: button; }\n\noutput {\n  display: inline-block; }\n\nsummary {\n  display: list-item; }\n\ntemplate {\n  display: none; }\n\n[hidden] {\n  display: none !important; }\n\nh1, h2, h3, h4, h5, h6,\n.h1, .h2, .h3, .h4, .h5, .h6 {\n  margin-bottom: 0.5rem;\n  font-family: inherit;\n  font-weight: 500;\n  line-height: 1.1;\n  color: inherit; }\n\nh1, .h1 {\n  font-size: 2.5rem; }\n\nh2, .h2 {\n  font-size: 2rem; }\n\nh3, .h3 {\n  font-size: 1.75rem; }\n\nh4, .h4 {\n  font-size: 1.5rem; }\n\nh5, .h5 {\n  font-size: 1.25rem; }\n\nh6, .h6 {\n  font-size: 1rem; }\n\n.lead {\n  font-size: 1.25rem;\n  font-weight: 300; }\n\n.display-1 {\n  font-size: 6rem;\n  font-weight: 300;\n  line-height: 1.1; }\n\n.display-2 {\n  font-size: 5.5rem;\n  font-weight: 300;\n  line-height: 1.1; }\n\n.display-3 {\n  font-size: 4.5rem;\n  font-weight: 300;\n  line-height: 1.1; }\n\n.display-4 {\n  font-size: 3.5rem;\n  font-weight: 300;\n  line-height: 1.1; }\n\nhr {\n  margin-top: 1rem;\n  margin-bottom: 1rem;\n  border: 0;\n  border-top: 1px solid rgba(0, 0, 0, 0.1); }\n\nsmall,\n.small {\n  font-size: 80%;\n  font-weight: normal; }\n\nmark,\n.mark {\n  padding: 0.2em;\n  background-color: #fcf8e3; }\n\n.list-unstyled {\n  padding-left: 0;\n  list-style: none; }\n\n.list-inline {\n  padding-left: 0;\n  list-style: none; }\n\n.list-inline-item {\n  display: inline-block; }\n  .list-inline-item:not(:last-child) {\n    margin-right: 5px; }\n\n.initialism {\n  font-size: 90%;\n  text-transform: uppercase; }\n\n.blockquote {\n  margin-bottom: 1rem;\n  font-size: 1.25rem; }\n\n.blockquote-footer {\n  display: block;\n  font-size: 80%;\n  color: #868e96; }\n  .blockquote-footer::before {\n    content: \"\\2014   \\A0\"; }\n\n.container {\n  margin-right: auto;\n  margin-left: auto;\n  padding-right: 15px;\n  padding-left: 15px;\n  width: 100%; }\n  @media (min-width: 576px) {\n    .container {\n      max-width: 540px; } }\n  @media (min-width: 768px) {\n    .container {\n      max-width: 720px; } }\n  @media (min-width: 992px) {\n    .container {\n      max-width: 960px; } }\n  @media (min-width: 1200px) {\n    .container {\n      max-width: 1140px; } }\n\n.container-fluid {\n  width: 100%;\n  margin-right: auto;\n  margin-left: auto;\n  padding-right: 15px;\n  padding-left: 15px;\n  width: 100%; }\n\n.row {\n  display: flex;\n  flex-wrap: wrap;\n  margin-right: -15px;\n  margin-left: -15px; }\n\n.no-gutters {\n  margin-right: 0;\n  margin-left: 0; }\n  .no-gutters > .col,\n  .no-gutters > [class*=\"col-\"] {\n    padding-right: 0;\n    padding-left: 0; }\n\n.col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col,\n.col-auto, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm,\n.col-sm-auto, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md,\n.col-md-auto, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg,\n.col-lg-auto, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl,\n.col-xl-auto {\n  position: relative;\n  width: 100%;\n  min-height: 1px;\n  padding-right: 15px;\n  padding-left: 15px; }\n\n.col {\n  flex-basis: 0;\n  flex-grow: 1;\n  max-width: 100%; }\n\n.col-auto {\n  flex: 0 0 auto;\n  width: auto;\n  max-width: none; }\n\n.col-1 {\n  flex: 0 0 8.33333%;\n  max-width: 8.33333%; }\n\n.col-2 {\n  flex: 0 0 16.66667%;\n  max-width: 16.66667%; }\n\n.col-3 {\n  flex: 0 0 25%;\n  max-width: 25%; }\n\n.col-4 {\n  flex: 0 0 33.33333%;\n  max-width: 33.33333%; }\n\n.col-5 {\n  flex: 0 0 41.66667%;\n  max-width: 41.66667%; }\n\n.col-6 {\n  flex: 0 0 50%;\n  max-width: 50%; }\n\n.col-7 {\n  flex: 0 0 58.33333%;\n  max-width: 58.33333%; }\n\n.col-8 {\n  flex: 0 0 66.66667%;\n  max-width: 66.66667%; }\n\n.col-9 {\n  flex: 0 0 75%;\n  max-width: 75%; }\n\n.col-10 {\n  flex: 0 0 83.33333%;\n  max-width: 83.33333%; }\n\n.col-11 {\n  flex: 0 0 91.66667%;\n  max-width: 91.66667%; }\n\n.col-12 {\n  flex: 0 0 100%;\n  max-width: 100%; }\n\n.order-1 {\n  order: 1; }\n\n.order-2 {\n  order: 2; }\n\n.order-3 {\n  order: 3; }\n\n.order-4 {\n  order: 4; }\n\n.order-5 {\n  order: 5; }\n\n.order-6 {\n  order: 6; }\n\n.order-7 {\n  order: 7; }\n\n.order-8 {\n  order: 8; }\n\n.order-9 {\n  order: 9; }\n\n.order-10 {\n  order: 10; }\n\n.order-11 {\n  order: 11; }\n\n.order-12 {\n  order: 12; }\n\n@media (min-width: 576px) {\n  .col-sm {\n    flex-basis: 0;\n    flex-grow: 1;\n    max-width: 100%; }\n  .col-sm-auto {\n    flex: 0 0 auto;\n    width: auto;\n    max-width: none; }\n  .col-sm-1 {\n    flex: 0 0 8.33333%;\n    max-width: 8.33333%; }\n  .col-sm-2 {\n    flex: 0 0 16.66667%;\n    max-width: 16.66667%; }\n  .col-sm-3 {\n    flex: 0 0 25%;\n    max-width: 25%; }\n  .col-sm-4 {\n    flex: 0 0 33.33333%;\n    max-width: 33.33333%; }\n  .col-sm-5 {\n    flex: 0 0 41.66667%;\n    max-width: 41.66667%; }\n  .col-sm-6 {\n    flex: 0 0 50%;\n    max-width: 50%; }\n  .col-sm-7 {\n    flex: 0 0 58.33333%;\n    max-width: 58.33333%; }\n  .col-sm-8 {\n    flex: 0 0 66.66667%;\n    max-width: 66.66667%; }\n  .col-sm-9 {\n    flex: 0 0 75%;\n    max-width: 75%; }\n  .col-sm-10 {\n    flex: 0 0 83.33333%;\n    max-width: 83.33333%; }\n  .col-sm-11 {\n    flex: 0 0 91.66667%;\n    max-width: 91.66667%; }\n  .col-sm-12 {\n    flex: 0 0 100%;\n    max-width: 100%; }\n  .order-sm-1 {\n    order: 1; }\n  .order-sm-2 {\n    order: 2; }\n  .order-sm-3 {\n    order: 3; }\n  .order-sm-4 {\n    order: 4; }\n  .order-sm-5 {\n    order: 5; }\n  .order-sm-6 {\n    order: 6; }\n  .order-sm-7 {\n    order: 7; }\n  .order-sm-8 {\n    order: 8; }\n  .order-sm-9 {\n    order: 9; }\n  .order-sm-10 {\n    order: 10; }\n  .order-sm-11 {\n    order: 11; }\n  .order-sm-12 {\n    order: 12; } }\n\n@media (min-width: 768px) {\n  .col-md {\n    flex-basis: 0;\n    flex-grow: 1;\n    max-width: 100%; }\n  .col-md-auto {\n    flex: 0 0 auto;\n    width: auto;\n    max-width: none; }\n  .col-md-1 {\n    flex: 0 0 8.33333%;\n    max-width: 8.33333%; }\n  .col-md-2 {\n    flex: 0 0 16.66667%;\n    max-width: 16.66667%; }\n  .col-md-3 {\n    flex: 0 0 25%;\n    max-width: 25%; }\n  .col-md-4 {\n    flex: 0 0 33.33333%;\n    max-width: 33.33333%; }\n  .col-md-5 {\n    flex: 0 0 41.66667%;\n    max-width: 41.66667%; }\n  .col-md-6 {\n    flex: 0 0 50%;\n    max-width: 50%; }\n  .col-md-7 {\n    flex: 0 0 58.33333%;\n    max-width: 58.33333%; }\n  .col-md-8 {\n    flex: 0 0 66.66667%;\n    max-width: 66.66667%; }\n  .col-md-9 {\n    flex: 0 0 75%;\n    max-width: 75%; }\n  .col-md-10 {\n    flex: 0 0 83.33333%;\n    max-width: 83.33333%; }\n  .col-md-11 {\n    flex: 0 0 91.66667%;\n    max-width: 91.66667%; }\n  .col-md-12 {\n    flex: 0 0 100%;\n    max-width: 100%; }\n  .order-md-1 {\n    order: 1; }\n  .order-md-2 {\n    order: 2; }\n  .order-md-3 {\n    order: 3; }\n  .order-md-4 {\n    order: 4; }\n  .order-md-5 {\n    order: 5; }\n  .order-md-6 {\n    order: 6; }\n  .order-md-7 {\n    order: 7; }\n  .order-md-8 {\n    order: 8; }\n  .order-md-9 {\n    order: 9; }\n  .order-md-10 {\n    order: 10; }\n  .order-md-11 {\n    order: 11; }\n  .order-md-12 {\n    order: 12; } }\n\n@media (min-width: 992px) {\n  .col-lg {\n    flex-basis: 0;\n    flex-grow: 1;\n    max-width: 100%; }\n  .col-lg-auto {\n    flex: 0 0 auto;\n    width: auto;\n    max-width: none; }\n  .col-lg-1 {\n    flex: 0 0 8.33333%;\n    max-width: 8.33333%; }\n  .col-lg-2 {\n    flex: 0 0 16.66667%;\n    max-width: 16.66667%; }\n  .col-lg-3 {\n    flex: 0 0 25%;\n    max-width: 25%; }\n  .col-lg-4 {\n    flex: 0 0 33.33333%;\n    max-width: 33.33333%; }\n  .col-lg-5 {\n    flex: 0 0 41.66667%;\n    max-width: 41.66667%; }\n  .col-lg-6 {\n    flex: 0 0 50%;\n    max-width: 50%; }\n  .col-lg-7 {\n    flex: 0 0 58.33333%;\n    max-width: 58.33333%; }\n  .col-lg-8 {\n    flex: 0 0 66.66667%;\n    max-width: 66.66667%; }\n  .col-lg-9 {\n    flex: 0 0 75%;\n    max-width: 75%; }\n  .col-lg-10 {\n    flex: 0 0 83.33333%;\n    max-width: 83.33333%; }\n  .col-lg-11 {\n    flex: 0 0 91.66667%;\n    max-width: 91.66667%; }\n  .col-lg-12 {\n    flex: 0 0 100%;\n    max-width: 100%; }\n  .order-lg-1 {\n    order: 1; }\n  .order-lg-2 {\n    order: 2; }\n  .order-lg-3 {\n    order: 3; }\n  .order-lg-4 {\n    order: 4; }\n  .order-lg-5 {\n    order: 5; }\n  .order-lg-6 {\n    order: 6; }\n  .order-lg-7 {\n    order: 7; }\n  .order-lg-8 {\n    order: 8; }\n  .order-lg-9 {\n    order: 9; }\n  .order-lg-10 {\n    order: 10; }\n  .order-lg-11 {\n    order: 11; }\n  .order-lg-12 {\n    order: 12; } }\n\n@media (min-width: 1200px) {\n  .col-xl {\n    flex-basis: 0;\n    flex-grow: 1;\n    max-width: 100%; }\n  .col-xl-auto {\n    flex: 0 0 auto;\n    width: auto;\n    max-width: none; }\n  .col-xl-1 {\n    flex: 0 0 8.33333%;\n    max-width: 8.33333%; }\n  .col-xl-2 {\n    flex: 0 0 16.66667%;\n    max-width: 16.66667%; }\n  .col-xl-3 {\n    flex: 0 0 25%;\n    max-width: 25%; }\n  .col-xl-4 {\n    flex: 0 0 33.33333%;\n    max-width: 33.33333%; }\n  .col-xl-5 {\n    flex: 0 0 41.66667%;\n    max-width: 41.66667%; }\n  .col-xl-6 {\n    flex: 0 0 50%;\n    max-width: 50%; }\n  .col-xl-7 {\n    flex: 0 0 58.33333%;\n    max-width: 58.33333%; }\n  .col-xl-8 {\n    flex: 0 0 66.66667%;\n    max-width: 66.66667%; }\n  .col-xl-9 {\n    flex: 0 0 75%;\n    max-width: 75%; }\n  .col-xl-10 {\n    flex: 0 0 83.33333%;\n    max-width: 83.33333%; }\n  .col-xl-11 {\n    flex: 0 0 91.66667%;\n    max-width: 91.66667%; }\n  .col-xl-12 {\n    flex: 0 0 100%;\n    max-width: 100%; }\n  .order-xl-1 {\n    order: 1; }\n  .order-xl-2 {\n    order: 2; }\n  .order-xl-3 {\n    order: 3; }\n  .order-xl-4 {\n    order: 4; }\n  .order-xl-5 {\n    order: 5; }\n  .order-xl-6 {\n    order: 6; }\n  .order-xl-7 {\n    order: 7; }\n  .order-xl-8 {\n    order: 8; }\n  .order-xl-9 {\n    order: 9; }\n  .order-xl-10 {\n    order: 10; }\n  .order-xl-11 {\n    order: 11; }\n  .order-xl-12 {\n    order: 12; } }\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box; }\n\nhtml {\n  font-family: sans-serif;\n  line-height: 1.15;\n  -webkit-text-size-adjust: 100%;\n  -ms-text-size-adjust: 100%;\n  -ms-overflow-style: scrollbar;\n  -webkit-tap-highlight-color: transparent; }\n\n@-ms-viewport {\n  width: device-width; }\n\narticle, aside, dialog, figcaption, figure, footer, header, hgroup, main, nav, section {\n  display: block; }\n\nbody {\n  margin: 0;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-size: 1rem;\n  font-weight: normal;\n  line-height: 1.5;\n  color: #212529;\n  text-align: left;\n  background-color: #fff; }\n\n[tabindex=\"-1\"]:focus {\n  outline: none !important; }\n\nhr {\n  box-sizing: content-box;\n  height: 0;\n  overflow: visible; }\n\nh1, h2, h3, h4, h5, h6 {\n  margin-top: 0;\n  margin-bottom: .5rem; }\n\np {\n  margin-top: 0;\n  margin-bottom: 1rem; }\n\nabbr[title],\nabbr[data-original-title] {\n  text-decoration: underline;\n  text-decoration: underline dotted;\n  cursor: help;\n  border-bottom: 0; }\n\naddress {\n  margin-bottom: 1rem;\n  font-style: normal;\n  line-height: inherit; }\n\nol,\nul,\ndl {\n  margin-top: 0;\n  margin-bottom: 1rem; }\n\nol ol,\nul ul,\nol ul,\nul ol {\n  margin-bottom: 0; }\n\ndt {\n  font-weight: bold; }\n\ndd {\n  margin-bottom: .5rem;\n  margin-left: 0; }\n\nblockquote {\n  margin: 0 0 1rem; }\n\ndfn {\n  font-style: italic; }\n\nb,\nstrong {\n  font-weight: bolder; }\n\nsmall {\n  font-size: 80%; }\n\nsub,\nsup {\n  position: relative;\n  font-size: 75%;\n  line-height: 0;\n  vertical-align: baseline; }\n\nsub {\n  bottom: -.25em; }\n\nsup {\n  top: -.5em; }\n\na {\n  color: #007bff;\n  text-decoration: none;\n  background-color: transparent;\n  -webkit-text-decoration-skip: objects; }\n  a:hover {\n    color: #0056b3;\n    text-decoration: underline; }\n\na:not([href]):not([tabindex]) {\n  color: inherit;\n  text-decoration: none; }\n  a:not([href]):not([tabindex]):focus, a:not([href]):not([tabindex]):hover {\n    color: inherit;\n    text-decoration: none; }\n  a:not([href]):not([tabindex]):focus {\n    outline: 0; }\n\npre,\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em; }\n\npre {\n  margin-top: 0;\n  margin-bottom: 1rem;\n  overflow: auto; }\n\nfigure {\n  margin: 0 0 1rem; }\n\nimg {\n  vertical-align: middle;\n  border-style: none; }\n\nsvg:not(:root) {\n  overflow: hidden; }\n\na,\narea,\nbutton,\n[role=\"button\"],\ninput,\nlabel,\nselect,\nsummary,\ntextarea {\n  touch-action: manipulation; }\n\ntable {\n  border-collapse: collapse; }\n\ncaption {\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n  color: #868e96;\n  text-align: left;\n  caption-side: bottom; }\n\nth {\n  text-align: inherit; }\n\nlabel {\n  display: inline-block;\n  margin-bottom: .5rem; }\n\nbutton:focus {\n  outline: 1px dotted;\n  outline: 5px auto -webkit-focus-ring-color; }\n\ninput,\nbutton,\nselect,\noptgroup,\ntextarea {\n  margin: 0;\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit; }\n\nbutton,\ninput {\n  overflow: visible; }\n\nbutton,\nselect {\n  text-transform: none; }\n\nbutton,\nhtml [type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; }\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  padding: 0;\n  border-style: none; }\n\ninput[type=\"radio\"],\ninput[type=\"checkbox\"] {\n  box-sizing: border-box;\n  padding: 0; }\n\ninput[type=\"date\"],\ninput[type=\"time\"],\ninput[type=\"datetime-local\"],\ninput[type=\"month\"] {\n  -webkit-appearance: listbox; }\n\ntextarea {\n  overflow: auto;\n  resize: vertical; }\n\nfieldset {\n  min-width: 0;\n  padding: 0;\n  margin: 0;\n  border: 0; }\n\nlegend {\n  display: block;\n  width: 100%;\n  max-width: 100%;\n  padding: 0;\n  margin-bottom: .5rem;\n  font-size: 1.5rem;\n  line-height: inherit;\n  color: inherit;\n  white-space: normal; }\n\nprogress {\n  vertical-align: baseline; }\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\n[type=\"search\"] {\n  outline-offset: -2px;\n  -webkit-appearance: none; }\n\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\n::-webkit-file-upload-button {\n  font: inherit;\n  -webkit-appearance: button; }\n\noutput {\n  display: inline-block; }\n\nsummary {\n  display: list-item; }\n\ntemplate {\n  display: none; }\n\n[hidden] {\n  display: none !important; }\n\n.body {\n  line-height: normal; }\n\nh1, .h1, h2, h3, h4 {\n  margin-top: 0;\n  margin-bottom: 0; }\n\nh1, .h1 {\n  color: #f54e29;\n  text-transform: uppercase;\n  position: relative;\n  font-size: 1.5rem; }\n\n.h2, h2 {\n  color: #ffffff;\n  background-color: #484440;\n  font-size: 1.25rem;\n  transition: text-shadow 0.3s ease-in-out; }\n\nh2:hover {\n  text-shadow: 2px 0 0px #fff; }\n\nh3 {\n  font-size: 1rem; }\n\n.img-fluid {\n  width: 100%; }\n\n@media screen and (max-width: 1140px) {\n  .container, .container-fluid {\n    overflow-x: hidden;\n    flex-direction: column; } }\n\n@media screen and (max-width: 540px) {\n  .container, .container-fluid {\n    padding: 0; } }\n\n.header {\n  display: flex;\n  flex-direction: row;\n  justify-content: flex-start;\n  align-items: flex-end;\n  background-color: #484440;\n  padding: 2px;\n  min-height: 4rem;\n  max-height: 4rem; }\n  @media screen and (max-width: 768px) {\n    .header {\n      flex-direction: column;\n      justify-content: flex-end;\n      background-image: url(\"public/Git-Icon-White.png\");\n      background-attachment: scroll;\n      background-position: center right;\n      background-repeat: no-repeat;\n      background-size: 60%; } }\n\n.git-logo {\n  display: flex;\n  justify-content: center;\n  align-self: center; }\n  .git-logo img {\n    max-height: 4rem;\n    max-width: 4rem; }\n  @media screen and (max-width: 768px) {\n    .git-logo {\n      display: none; } }\n\n.git-btn-follow {\n  height: 20px;\n  width: 106px; }\n  @media screen and (max-width: 960px) {\n    .git-btn-follow {\n      margin-right: .5rem; } }\n\n.git-btn-fork {\n  height: 20px;\n  width: 52px; }\n  @media screen and (max-width: 960px) {\n    .git-btn-fork {\n      margin-right: .5rem; } }\n\n.git-btn-like {\n  height: 20px;\n  width: 75px; }\n  @media screen and (max-width: 960px) {\n    .git-btn-like {\n      margin-right: .5rem; } }\n\n.content-table {\n  display: block;\n  min-width: 15rem;\n  color: #f54e29;\n  margin: 0 0 1rem 0; }\n  .content-table > aside {\n    top: 1rem;\n    position: sticky; }\n  .content-table > aside > a {\n    color: #f54e29;\n    background: transparent;\n    display: block;\n    margin-bottom: .05rem; }\n  .content-table > aside > a:hover {\n    background-color: #484440;\n    color: white; }\n  @media screen and (max-width: 576px) {\n    .content-table {\n      display: flex;\n      justify-content: center; } }\n  @media screen and (max-width: 768px) {\n    .content-table {\n      min-width: 50%; } }\n  @media screen and (max-width: 1101px) {\n    .content-table {\n      top: auto;\n      margin-bottom: 10px;\n      position: relative; }\n      .content-table > a {\n        margin-bottom: .25rem; } }\n\n.content-main h1 .anchor {\n  color: #f54e29;\n  margin-left: -20px;\n  opacity: 0; }\n  .content-main h1 .anchor:hover {\n    opacity: 1; }\n\n.content-main div p {\n  margin: 0 0 .25rem auto; }\n\n@media screen and (min-width: 1102px) {\n  .content-main div p {\n    margin-left: .5rem; } }\n\n@media screen and (max-width: 1101px) {\n  .content-main {\n    margin-top: 10px; } }\n\n.go-to-top {\n  position: fixed;\n  bottom: 15px;\n  right: 15px;\n  border: 0 solid white;\n  border-radius: 2px;\n  background-color: white;\n  width: 40px;\n  text-align: center;\n  font-weight: 400;\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);\n  transition: box-shadow .1s ease-in, transform .1s ease-in;\n  opacity: .30;\n  font-size: 16px; }\n  .go-to-top:hover {\n    opacity: .85;\n    cursor: pointer; }\n  .go-to-top:active {\n    transform: translateY(-5px) scale(1.1);\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25); }\n  .go-to-top a {\n    color: black; }\n  .go-to-top a:hover, .go-to-top a:active {\n    text-decoration: none; }\n\n::-webkit-scrollbar {\n  width: 5px;\n  position: fixed; }\n\n::-webkit-scrollbar-track {\n  width: 5px;\n  border-radius: 5px; }\n\n::-webkit-scrollbar-thumb {\n  width: 5px;\n  border-radius: 1px;\n  background-color: #f54e29; }\n\n::-webkit-scrollbar-thumb:hover {\n  width: 10px;\n  background-color: #350d00; }\n", ""]);

// exports


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
console.log("\nMade by Davronov Alexander.\nContact me via: al.neodim@gmail.com\nSource code can be found at http://github.com/hinell/git-book\n");
__webpack_require__(2);
var synopsis = __webpack_require__(6);
window.addEventListener('load', function () {
    // Edge bug workaround
    document.body.style['line-height'] = document.body.style['line-height'];
    //    performance.mark('syninsrt-start')
    var article = document.body.getElementsByTagName('article')[0];
    article.content = document.createDocumentFragment();
    typeof article.insertAdjacentHTML === 'undefined'
        ? article.insertAdjacentHTML("beforeend", synopsis)
        : article.innerHTML = synopsis;
    //    performance.mark('syninsrt-end')
    //    performance.measure('synopsis-load','syninsrt-start','syninsrt-end')
    //let synopsisperf = performance.getEntriesByName('synopsis-load')[0];
    //    console.log('Synopsis render has taken: ',synopsisperf.duration);
    var headers = [].slice.call((document.body.getElementsByTagName('article')[0]).getElementsByTagName('h1'));
    headers = headers.map(function (header) {
        header.originalText = header.textContent;
        header.id = header.textContent
            .trim()
            .replace(/\./g, '')
            .replace(/\t/, '')
            .replace(/\s+/g, '');
        return header;
    });
    var anchors = headers.map(function (header) {
        var anchor = document.createElement('a');
        anchor.textContent = '#';
        anchor.className = 'anchor';
        anchor.href = '#' + header.id;
        header.insertAdjacentElement('afterbegin', anchor);
        return anchor;
    });
    var contenttitle = document.createElement('h3');
    contenttitle.textContent = 'CONTENT'; //<h>CONTENT<h>
    var contenttable = document.body.getElementsByTagName('aside')[0];
    // contenttable.className = 'content-table';
    contenttable.appendChild(contenttitle);
    // let location = window.location;
    headers.forEach(function (header) {
        ;
        var contentheader = document.createElement('a');
        contentheader.textContent = header.originalText;
        contentheader.original = header;
        contentheader.setAttribute('class', 'h2');
        contentheader.href = '#' + header.id;
        //contentheader.addEventListener('click',e => e.target.original.scrollIntoView())
        contentheader.addEventListener('click', function (e) {
            var headertarget = e.target.original;
            e.preventDefault();
            headertarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // location.tempHash = headertarget.id;
            // if we don't postpone hash change the page scrolled to quickly
            // setTimeout( foo => (console.log('HASH CHANGED'),location.hash = location.tempHash), 1500);
        });
        contenttable.appendChild(contentheader);
    });
});


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(0);
    // debugger
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(0, function() {
			var newContent = __webpack_require__(0);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     // debugger
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(5);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = '<h1>Introduction</h1><div id="Preface"><h2>   Description:</h2><p>This synopsis contains some notes collected from the <a href="http://git-scm.com/book/en/v2" >GIT Book</a>.</p><h2>   Author:</h2><p><a href="https://github.com/hinell">Hinell</a></p><p>It is was started at Mar 21, 2015 and ended on May 8, 2015</p><p>Redesigned during beginning of September 2017.</p></div><H1>1.      Getting started.</H1><H2>1.3.    Git Basics.</H2><div id="13"><h3>   Snapshots.</h3><p><Every>time you commit, or save the state of your project in Git,</Every><it>basically takes a picture of what all your files look like at that moment</it><and>stores a reference to that snapshot (if files have not changed,</and></p><p><Git>doesn\'t store the file again (like others VCSs),</Git><just>a link to the previous identical file it has already stored.)</just></p><p>   Git thinks about its data more like a stream of snapshots.</p><h3>   Nearly Every Operation Is Local.</h3><p><Git>only need local files and resources to operate unlike</Git><other>VCSs which have latency network overhead.</other></p><h3>   Git Has Integrity.</h3><h3>   Git Generally Only Aps Data.</h3><p>   In Git, doing nearly all of actions, you only ap data to the Git database.</p><p><It>is very difficult to lose your data,</It><especially>if you regularly push your database to another repository.</especially></p><p><Everything>(files, dirs) in Git is check-summed before it\'s stored (to GIT) and</Everything><is>then referred to by that checksum.</is></p><p>   This means it’s impossible to change the contents without Git knowing about it.</p><p>   Git hash-mechanism: SHA-1</p><p>   Git stored snapshots in DB by the hash.</p></div><h1>     2.      Git Basics.</h1><H2>     2.1.     Getting a Git Repository</H2><div id="21"><p></p><h3>  Git initializing in an Existing Directory</h3><p>   Init in a current directory: [$ git init]</p><h3>  Cloning an Existing Repository.</h3><p>   You clone a repository with: [$ git clone [url]].</p></div><H2>     2.2.    Recording Changes to the Repository</H2><div id="22"><h3>   Recording Changes to the Repository</h3><p><p>  Current dir - directory where git had initialized.</p><ul> Each file in the current directory may have two states:<ul><li>    untracked</li><li>    tracked</li></ul></ul><ul>  Tracked files are files that were of the last snapshot; their states:<ul><li>unmodified</li><li>modified</li><li>staged</li></ul></ul></p><h3>   Checking the Status of Your Files</h3><p>       Check status of files in current dir: [$ git status]</p><h3>    Tracking New Files</h3><p>       Begin tracking new file:[ $ git ap [file]]</p><h3>   Staging Modified Files</h3><p>       Git ap is a multipurpose command – you use it to begin tracking new files,</p><p>       to stage files, and to do other things like marking merge-conflicted files as resolved.</p><h3>   Ignoring Files</h3><p>       See .gitignore</p><h3>   Viewing Your Staged and Unstaged Changes</h3><p>       [$ git diff] - shows you the exact lines aped and removed – the patch, as it were.</p><h3>   Removing Files</h3><p>    Command: [$ git rm [file | dir]]</p>    This command simply delete tracked file.<h3>  Moving Files (Renaming)</h3><p>    If you want to rename a file in Git, you can run something like:</p>    [$ git mv file_from file_to]</div><H2>     2.3.   Viewing the Commit History.</H2><div id="23"><h3><a href="http://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History">Viewing the Commit History</a></h3><p>   To do this you need type the [$ git log] command.</p><p>   One of the more helpful options is [-p], which shows the difference introduced in each commit.</p><p>   You can also use [-2], which limits the output.</p><p>   If you want to see some abbreviated stats for each commit, you can use the [--stat] option.</p><p>   Another really useful option is [--pretty=oneline|short|full|fuller|format:]</p><p>   Show graph: [$ git log --graph]</p><p>   e.g.: [$ git log --pretty=format:"%h - %an, %ar : %s"]</p><p>   More info available on the above link.</p><p>   To see only the commits of a certain author: git log --author=bob</p><p>   Different between committer and author is the author is the person who originally wrote the work,</p><p>   whereas the committer is the person who last applied the work.</p><h3>   Limiting Log Output</h3><p></p><p>   With: [-n] where n is any integer to show the last n commits.</p><p>   The time-limiting options such as --since and --until.</p><p>   See other command in reference.</p><p>   Limiting with time: [$ git log --since=[date]]</p></div><H2>     2.4.    Undoing Things</H2><div id="24"><h3>   Undoing Things</h3><p>   [$ git commit --amend]</p><h3>   Unstaging a Staged File</h3><p>   To unstage content in current dir, you can use: [$ git reset HEAD <file>] command:</p><h3>   Unmodifying a Modified File</h3><p>   You can replace local changes using the command:</p><p>   [$ git checkout -- [file]] - be careful - is a dangerous command.</p><p>   This kept files already aped to the index,(new files).</p><p>   Remember, anything that is committed in Git can almost always be recovered.</p><p></p>    If you instead want to drop all your local changes, use:     [$ git fetch origin]. It fetch the latest history     from the server and point your local master branch.</div><H2>     2.5.     Working with Remotes</H2><div id="25"><p>   Remote repositories are versions of your project</p><p>   that are hosted on the Internet or network somewhere.</p><p>   Remotes enable you collaborate on any project remotely.</p><p>   It is them porpose.</p><h3>   Showing Your Remotes</h3><p>   To see which remote servers you have configured, you can run the [$ git remote]</p><h3>   Aping Remote Repositories</h3><p>   [$ git remote ap [shortname] [url]]</p><h3>   Fetching and Pulling from Your Remotes</h3><p>   As you just saw, to get data from your remote projects,</p><p>   you can run:[$ git fetch [remote-name]]</p><p>   For example, if you want to fetch all the information that remote repo has</p><p>   but that you don’t yet have in your repository, you can run [$ git fetch [shortname]]</p><p>   If you have a branch set up to track a remote branch, you can use</p><p>   the [$ git pull] command to automatically fetch and then merge a remote branch into your current branch.</p><h3>   Pushing to Your Remotes</h3><p>   When you have your project at a point that you want to share,</p><p>   you have to push it upstream. The command for this is simple:</p><p>   [git push [remote-name] [branch-name]]</p><h3>   Inspecting a Remote</h3><p>   If you want to see more information about a particular remote:</p><p>   [$ git remote show [remote-name] ]</p></div><H2>     2.6.    Tagging</H2><div id="26"><h3>   Tagging</h3><p>     Typically people use this functionality to mark release points (v1.0, and so on).</p><h3>   Listing Your Tags</h3><p>     [$ git tag]</p><p>   You can also search for tags with a particualar pattern like this</p><p>   [$ git tag -l \'v1.*\']</p><h3>   Creating Tags</h3><p>   Git uses two main types of tags:<li>     lightweight</li><li>     annotated.</li></p><p>   A lightweight tag is very much like a branch that doesn’t change – it’s just a pointer to a specific commit.</p><p>   Annotated tags, are stored as full objects in the Git database</p><p>   (including the tagger name, e-mail, date;</p><p>   a tagging message; and can be signed / verified with GNU Privacy Guard (GPG).)</p><h3>   Annotated Tags</h3><p>   The easiest way is to specify [-a | -m | -s ]: [$ git -a ]</p><p>   e.g.: [$ git tag -a v.1.4 - \'my version 1.4\']</p><p>   To see tag data along with commit that was tagged, use: [$ git show [tagname]]</p><h3>   Lightweight Tags</h3><p>   To create a lightweight tag, don’t supply the -a, -s, or -m option, i.e:</p><p>   [$ git tag v1.4-lw]</p><h3>   Tagging later</h3><p>   [$ git tag -a [tagName] [commit]] i.e.:</p><p>   [$ git tag -a v1.2 9fceb02]</p><h3>   Sharing Tags</h3><p>   Just run: [$ git push origin [tagname]</p><p>   By default the [$ git push] command doesn’t transfer tags to remote servers.</p><p>   To push up at once a lot of tags you can use the:[$ git push --tags]</p><h3>   Checking out Tags</h3><p>   You can create a new branch at a specific tag:[$ git checkout -b [branchname] [tag(v.2 etc)]]</p></div><H2>     2.7. Git Aliases</H2><div id="27"><p>   You can easily set up an alias for each command using git config:</p><p>   [$ git config --global alias.[nameOfNewCommand] ["git.command]"]</p><p>   i.e.: [$ git config --global alias.co checkout]</p><p>   However, maybe you want to run an external command</p><p>   you start the command with a ! character.</p><p>   e.g.: [$ git config --global alias.visual "!gitk"]</p></div><h1>     3. Git Branching</h1><H2>     3.1. Branching in a Nutshell.</H2><div id="31"><p>   Branching means you diverge from the main line of development</p><p>   and continue to do work without messing with that main line.</p><h3>   Branching in a Nutshell</h3><p>   When you make a commit, Git stores a commit object that</p><p>   contains a pointer to the snapshot of the content you staged.</p><h3>   Creating a New Branch</h3><p>   [$ git branch [branch name]]</p><p>   How does Git know what branch you’re currently on?</p><p>   It keeps a special pointer called HEAD.</p><p>   Note that this is a lot different than the concept of HEAD</p><p>   in other VCSs you may be used to, such as Subversion or CVS.</p><p>   The git branch command only created a new branch – it didn’t switch to that branch.</p><br/><p>   To see where the point of your HEAD, use:</p><p>   [$ git log --oneline --decorate]</p><p>   [$ git checkout [branch name]</p><p>   That command did two things.</p><p>   It moved the HEAD pointer back to point to the [branch name] branch,</p><p>   and it reverted the files in your working directory</p><p>   back to the snapshot that master points to.</p><p>   [git log --oneline --decorate --graph --all]</p></div><H2>     3.2. Basic Branching and Merging</H2><div id="32"><h3>   Basic Branching and Merging</h3><p>   At this stage, you’ll receive a call that another issue</p><p>   is critical and you need a hotfix. You’ll do the following:<ol><li>Switch to your production branch.</li><li>Create a branch to ap the hotfix.</li><li>After it’s tested, merge the hotfix branch, and push to production.</li><li>Switch back to your original story and continue working.</li></ol></p><h3>   Basic Merging</h3><p>   It’s worth pointing out that Git determines the best common ancestor to use</p><p>   for its merge base; this is different than older tools like CVS or Subversion (before version 1.5)</p></div><H2>     3.3. Branch Management</H2><div id="33"><p>   Notice the <b>*</b> indicates the branch (HEAD) that you currently have checked out .</p><p>   See last commit on each branch: [$ git branch -v]</p></div><H2>     3.4. Branching Workflows</H2><div id="34"><h3><a href="http://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows#Long-Running-Branches">Long-Running Branches</a></h3><p>   This means you can have several branches that are always open (ie master) and</p><p>   that you use for different stages of your development cycle;</p><p>   you can merge regularly from some of them into others.</p><h3></h3><h3><a href="http://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows#Topic Branches">Topic Branches</a></h3><p>   Topic branches, however, are useful in projects of any size.</p><p>   A topic branch is a short-lived branch that you create and</p><p>   use for a single particular feature or related work.</p><p>   A topic branch is a short-lived branch that you create and</p><p>   for a single particular feature or related work.</p></div><H2>     3.5. Remote Branches</H2><div id="35"><h3><a href="http://git-scm.com/book/en/v2/Git-Branching-Remote-Branches">Remote Branches</a></h3><p>   Remote branches are references (pointers) to the state of branches in your remote repositories.</p><p>   They’re local branches that you can’t move;</p><p>   they’re moved automatically for you whenever you do any network communication.</p><h3><a href="http://git-scm.com/book/en/v2/Git-Branching-Remote-Branches#Tracking-Branches">Tracking Branches</a></h3><p>   Checking out a local branch from a remote branch automatically creates what is called</p><p>   a “tracking branch" (or sometimes an “upstream branch").</p><p>   Tracking branches are local branches that have a direct relationship to a remote branch.</p><h3><a href="http://git-scm.com/book/en/v2/Git-Branching-Remote-Branches#Deleting-Remote-Branches">Deleting Remote Branches</a></h3><p>   If you want to delete your branch from the server, you run the following:</p><p>   [$ git push [remote name] --delete [branch name]]</p></div><H2>     3.6. Rebasing</H2><div id="36"><p>   In Git, there are two main ways to integrate changes from one branch into another:<ol><li>the merge</li><li>the rebase.</li></ol></p><h3>   The Basic Rebase</h3><p>   There is no difference in the end product (in comparing with merge tool)</p><p>   of the integration, but rebasing makes for a cleaner history.</p><h3><a href="http://git-scm.com/book/en/v2/Git-Branching-Rebasing#The-Basic-Rebase">The Basic Rebase</a></h3><p>  Commands:   [$ git<a href="http://git-scm.com/docs/git-rebase">   rebase</a>  --onto <newbase>]</p><h3><a href="http://git-scm.com/book/en/v2/Git-Branching-Rebasing#The-Perils-of-Rebasing">The Perils of Rebasing</a></h3><p>Do not rebase commits that exist outside your repository.</p><h3><a href="http://git-scm.com/book/en/v2/Git-Branching-Rebasing#Rebase-When-You-Rebase">Rebase When You Rebase</a></h3><p></p></div><h1>     4. Git on the Server</h1><H2>     4.1. The Protocols</H2><div id="41"><p>   Therefore, the preferred method for collaborating with someone</p><p>   is to set up an intermediate repository that you both have access to, and push to and pull from that.</p><h3>   The Protocols</h3><p>   Git can use four major protocols to transfer data:<ul><li><a href="http://git-scm.com/book/en/v2/Git-on-the-Server-The-Protocols#Local-Protocol">Local</a></li><li><a href="http://git-scm.com/book/en/v2/Git-on-the-Server-The-Protocols#The-HTTP-Protocols">HTTP</a></li><li><a href="http://git-scm.com/book/en/v2/Git-on-the-Server-The-Protocols#The-SSH-Protocol">Secure Shell (SSH)</a></li><li><a href="http://git-scm.com/book/en/v2/Git-on-the-Server-The-Protocols#The-Git-Protocol">Git</a></li></ul></p><p></p></div><H2>     4.2. Getting Git on a Server</H2><div id="42"><h3><a href="http://git-scm.com/book/en/v2/Git-on-the-Server-Getting-Git-on-a-Server">Getting Git on a Server</a></h3><p>   In order to initially set up any Git server,</p><p>   you have to export an existing repository into a new bare repository –</p><p>   a repository that doesn’t contain a working directory.</p><p>   This is generally straightforward to do.</p><p>   By convention, bare repository directories end in .git</p><p>   In order to clone repo, you run clone command with --bare:</p><p>   [$ git clone --bare [url to repo] [cloned repo name].git ]</p><p>   This is roughly equivalent to something like</p><p>   [$ cp -Rf my_repo/.git my_local_repo.git]</p><p>   Git will automatically ap group write permissions to a repository properly</p><p>   if you run the git init command with the --shared option:</p><p>   [$ git init --bare --shared]</p><h3><a href="http://git-scm.com/book/en/v2/Git-on-the-Server-Getting-Git-on-a-Server#Putting-the-Bare-Repository-on-a-Server">Putting the Bare Repository on a Server </a></h3><p>   Let’s say you’ve set up a server called git.example.com</p><p>   Further you can set up your new repository by copying your bare repository over:</p><p>   [$ scp -r my_project.git user@git.example.com:[/path/to/new/repo]]</p><p>   After all, now, user\'s who have SSH acsess to the same serve</p><p>   can clone your repository by running</p><p>   [$ git clone user@git.example.com:[/path/to/new/repo].git]</p><h3><a href="http://git-scm.com/book/en/v2/Git-on-the-Server-Getting-Git-on-a-Server#Small-Setups">Small Setups</a></h3><p>   One of the most complicated aspects of setting up a Git server is user management.</p><h3>   SSH Access</h3><p>   There are a few ways you can give access to everyone on your team:<ul><li> Just set up accounts (obviously system) for everybody.</li><li>Create a signle git user on the machine and ask every user who is to have write access to send you an SSH public key, and ap that key to the ~/.ssh/authorized_keys</li><li>Another way to do it is to have your SSH server authenticate from an LDAP server or some other centralized authentication source that you may already have set up  </li></ul></p></div><H2>     4.3. Generating Your SSH Public Key</H2><div id="43"><h3><a href="http://git-scm.com/book/en/v2/Git-on-the-Server-Generating-Your-SSH-Public-Key">Generation SSH key</a></h3><p>   First, you should check to make sure you don’t already have a key.</p><p>   By default, a user\'s SSH key are stored in that user\'s ~/.ssh directory</p><p>   and key\'s files named like id_dsa or id_rsa and a matching file with a</p><p>   .pub extension.</p><p>   If you don\'t have these files, you can create them by program called ssh-keygen:</p><p>   [$ ssh-keygend -t rsa -C "your@email.com"];</p><p>   which  provided on almost all current system platform (Linux/Mac, on NT with MSysGit package).</p><p>   Now, each user that does this has to send their public key to the Git server</p><p>   (assuming you’re using an SSH server setup that requires public keys).</p><p>   All they have to do is compy the content of the .pub file and send it.</p><h3><a href="https://help github.com/articles/generating-ssh-keys.">GitHub article</a></h3><p>   Click to open up help for SSH key generation on GitHub Help service.</p></div><H2>     4.4. Setting Up the Server</H2><div id="44"><h3><a href="http://git-scm.com/book/en/v2/Git-on-the-Server-Setting-Up-the-Server">Setting Up the Server</a></h3><p>   First, you create (on Nix-systems - you also should create a git user) a .ssh directory for that user.</p><p>   Next, you need to ap some developer SSH public keys to the ~/.ssh/authorized_keys directory.</p><p>   Now, you can set up an empty repository.</p></div><H2>     4.5. Git Daemon</H2><div id="45"><h3><a href="http://git-scm.com/book/en/v2/Git-on-the-Server-Git-Daemon">Git Daemon</a></h3><p>   In any case, the Git protocol is relatively easy to set up</p><p>   Basically, you need to run this command in a daemonized manner:</p><p>   Remember that since it’s not an authenticated service,</p><p>   anything you serve over this protocol is public within its network.</p><p>   --reuseapr allows the server to restart without waiting for old connections to time out</p><p>   --base-path option allows people to clone projects without specifying the entire path</p><p>   and the path at the end tells the Git daemon where to look for repositories to export.</p><p></p></div><H2>     4.6. Smart HTTP</H2><div id="46"><h3><a href="http://git-scm.com/book/en/v2/Git-on-the-Server-Smart-HTTP">Smart HTTP</a></h3><p>   Setting up Smart HTTP is basically just enabling</p><p>   a CGI script that is provided with Git called [git-http-backend] on the server.</p></div><H2>     4.7. GitWeb</H2><div id="47"><h3><a href="http://git-scm.com/book/en/v2/Git-on-the-Server-GitWeb">GitWeb</a></h3><p>   Git comes with a CGI script called GitWeb that is</p><p>   provided simple web-based visualizer.</p></div><H2>     4.8. GitLab</H2><div id="48"><p>   If you’re looking for a more modern, fully featured Git server,</p><p>   there are some several open source solutions out there that you can install instead.</p><h3><a href="http://git-scm.com/book/en/v2/Git-on-the-Server-GitLab#Installation">Installation</a></h3><p>   GitLab is a database-backed web application</p><p>   To get something up and running quickly, you can download a virtual machine image or</p><p>   a one-click installer from https://bitnami.com/stack/gitlab,</p><p>   and tweak the configuration to match your particular environment.</p></div><H2>     4.9. Third Party Hosted Options</H2><div id="49"><h3><a href="http://git-scm.com/book/en/v2/Git-on-the-Server-Third-Party-Hosted-Options"></a>  Third Party Hosted Options</h3><p>   These days, you have a huge number of hosting options to choose from.</p><p>   To see an up-to-date list, check out the GitHosting page on the main<a href="https://git.wiki.kernel.org/index.php/GitHosting">  Git wiki</a></p></div><h1>     5. Distributed Git</h1><H2>     5.1. Distributed Workflows</H2><div id="51"><h3>   Distributed Workflows</h3><p>   Unlike another centralized VCS, GIT allows every developer to be</p><p>   on both a node and a hub states.</p><p>   So lets cover a few common paradigms of workflow:</p><h3><a href="http://git-scm.com/book/en/v2/Distributed-Git-Distributed-Workflows#Centralized-Workflow">Centralized Workflow</a></h3><p><img class="img-fluid" src="http://www.shaney.net/git/images/centralized.png"/></p><p>   One central hub, or repository, can accept code, and everyone synchronizes their work to it.</p><p>   This is also not limited to small teams.</p><hr/><h3><a href="http://git-scm.com/book/en/v2/Distributed-Git-Distributed-Workflows#Integration-Manager-Workflow">Integration-Manager Workflow</a></h3><p><img class="img-fluid" src="http://git-scm.com/book/en/v2/book/05-distributed-git/images/integration-manager.png"/></p><p></p><p>   Because Git allows you to have multiple remote repositories,</p><p>   it’s possible to have a workflow where each developer</p><p>   has write access to their own public repository and read access to everyone else’s.</p><p>   The process works as follows:</p><p><ol><li>The project maintainer pushes to their public repository.</li><li> A contributor clones that repository and makes changes.</li><li> The contributor pushes to their own public copy.</li><li> The contributor sends the maintainer an e-mail asking them to pull changes.</li><li> The maintainer aps the contributor’s repo as a remote and merges locally.</li><li> The maintainer pushes merged changes to the main repository.</li></ol></p><h3><a href="http://git-scm.com/book/en/v2/Distributed-Git-Distributed-Workflows#Dictator-and-Lieutenants-Workflow">Dictator and Lieutenants Workflow</a></h3><p><img class="img-fluid" src="http://git-scm.com/book/en/v2/book/05-distributed-git/images/benevolent-dictator.png"/></p><p>   This is a variant of a multiple-repository workflow.</p><p>   It’s generally used by huge projects with hundreds of collaborators;</p><p>   Various integration managers are in charge of certain parts of the repository;</p><p>   they’re called lieutenants.</p><p>   All the lieutenants have one integration manager known as the benevolent dictator.</p><p>   The process works like this:<ol><li>Regular developers work on their topic branch and rebase their work on top of master. The master branch is that of the dictator.</li><li>Lieutenants merge the developers’ topic branches into their master branch.</li><li>The dictator merges the lieutenants’ master branches into the dictator’s master branch.</li><li>The dictator pushes their master to the reference repository so the other developers can rebase on it.</li></ol></p></div><h2>   5.2. Contributing to a Project</h2><div id="52"><h3>   Contributing to a Project</h3><p>   The main difficulty with describing how to contribute to a project</p><p>   is that there are a huge number of variations on how it’s done.</p><h3><a href="http://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project#Commit-Guidelines">Commit Guidelines</a></h3><p>   Before we start looking at the specific use cases, here’s a quick note about commit messages.</p><p>   First, you don’t want to submit any whitespace errors.</p><p>   Before you commit, run [$ git diff --check] -</p><p>   It is identifies possible whitespace errors and lists them for you.</p><p>   Next, try to make each commit a logically separate changeset.</p><p>   If you can, try to make your changes digestible – don’t code for a whole weekend on five different issues</p><p>   and then submit them all as one massive commit on Monday.</p><p>   The last thing to keep in mind is the commit message.</p><p>   Here is a template originally written by Tim Pope:</p><p><blockquote class="text-whitespaces">Short (50 chars or less) summary of changes  More detailed explanatory text, if necessary.  Wrap it to about 72 characters or so.  In some contexts, the first line is treated as the subject of an email and the rest of the text as the body.  The blank line separating the summary from the body is critical (unless you omit the body entirely); tools like rebase can get confused if you run the two together.  Further paragraphs come after blank lines.    - Bullet points are okay, too    - Typically a hyphen or asterisk is used for the bullet,   preceded by a single space, with blank lines in   between, but conventions vary here</blockquote></p><h3><a href="http://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project#Private-Small-Team">Private Small Team</a></h3><p>   Before pushing changes from your local repo at the</p><p>   meantime as this doing another developers,</p><p>   you need fetch remote changes and then merge with your.</p><h3><a href="http://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project#Private-Managed-Team">Private Managed Team</a></h3><p>   The ability of smaller subgroups of a team to collaborate via</p><p>   remote branches without necessarily having to</p><p>   involve or impede the entire team is a huge benefit of Git.</p><h3><a href="http://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project#Forked-Public-Project">Forked Public Project</a></h3><p>   [$ git merge --no-commit --squash]</p><p>   The --squash option takes all the work on the merged branch</p><p>   and squashes it into one non-merge commit on top of the branch you’re on.</p><h3><a href="http://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project#Public-Project-over-E-Mail">Public Project over E-Mail</a></h3><p>   You can generate e-mail versions of each commit series</p><p>   and e-mail them to the developer mailing list</p></div><h2> 5.3. Maintaining a Project</h2><div id="53"><h3>   Contributing to a Project</h3><p></p><h3><a href="http://git-scm.com/book/en/v2/Distributed-Git-Maintaining-a-Project#Applying-Patches-from-E-mail">Applying Patches from E-mail</a></h3><p></p><h3><a href="http://git-scm.com/book/en/v2/Distributed-Git-Maintaining-a-Project#Checking-Out-Remote-Branches">Checking Out Remote Branches</a></h3><p>   The other advantage of this approach is that</p><p>   you get the history of the commits as well.</p><h3><a href="http://git-scm.com/book/en/v2/Distributed-Git-Maintaining-a-Project#Determining-What-Is-Introduced">Determining What Is Introduced</a></h3><p>   It’s often helpful to get a review of all the commits</p><p>   that are in this branch but that aren’t in your master branch.</p><p>   You can exclude commits in the master branch by</p><p>   aping the [--not] option before the branch name.</p><p>   This does the same thing as the [$ git log [branchname]..[branchname]] format that we used earlier.</p><p>   What you really want to see are the changes aped to the topic branch –</p><p>   the work you’ll introduce if you merge this branch with master, you</p><p>   can do: [$ git merge-base [branchname] [branchname]]</p><p>   A bit more convenient: [$ git diff [branchname]...[branchname]]</p><p>   This command shows you only the work your current topic branch has introduced since its common ancestor</p><h3><a href="http://git-scm.com/book/en/v2/Distributed-Git-Maintaining-a-Project#Integrating-Contributed-Work">Integrating Contributed Work</a></h3><p>   Main question is which overall workflow do you want</p><p>   to use to maintain your project? You have a number</p><p>   of choices, so we’ll cover a few of them.</p><h3>   Merging Workflows</h3><p>   If you have a more important project, you might want to</p><p>   use a two-phase merge cycle. In this scenario, you have two</p><p>   long-running branches, master and develop, in which you</p><p>   determine that master is updated only when a very stable</p><p>   release is cut and all new code is integrated into the develop branch.</p><h3>   Large-Merging Workflows</h3><h3>   Rebasing and Cherry Picking Workflows</h3><p>   he other way to move introduced work from one branch to another is</p><p>   to [$ git cherry-pick [target for merging wiht that you\'re currently on]].</p><p>   A cherry-pick in Git is like a rebase for a single commit.</p><p>   It takes the patch that was introduced in a commit and tries to reapply it on the branch you’re currently on.</p><h3>   Rerere</h3><p>   If you’re doing lots of merging and rebasing, or you’re maintaining</p><p>   a long-lived topic branch, Git has a feature called “rerere" that can help</p><p>   Rerere stands for “reuse recorded resolution" – it’s a way of shortcutting manual conflict resolution.</p><p>   This feature comes in two parts: a configuration setting and a command.</p><p>   The configuration setting is rerere.enabled:</p><p>   [$ git config --global rerere.enabled true]</p><p>   Now, whenever you do a merge that resolves conflicts,</p><p>   the resolution will be recorded in the cache in case you need it in the future.</p><h3><a href="http://git-scm.com/book/en/v2/Distributed-Git-Maintaining-a-Project#Tagging-Your-Releases">Tagging Your Releases </a></h3><h3>   Generating a Build Number</h3><h3>   Preparing a Release</h3><p>   One of the things you’ll want to do is create an archive of the latest snapshot</p><p>   of your code for those poor souls who don’t use Git. The command to do this is git archive:</p><p>   [$ git archive master --prefix=\'project/\' | gzip > `git describe master`.tar.gz]</p><h3><a href="http://git-scm.com/book/en/v2/Distributed-Git-Maintaining-a-Project#Tagging-Your-Releases">The Shortlog</a></h3><p>   It’s time to e-mail your mailing list of people who want to know what’s happening in your project.</p><p>   A nice way of quickly getting a sort of changelog</p><p>   is to use the [$ git shortlog]</p><p>   It summarizes all the commits in the range you give it; for example:</p><p>   [$ git shortlog --no-merges master --not v1.0.1                     ]</p></div><h1>     6. GitHub</h1><H2>     6.1. Account Setup and Configuration</H2><div id="61"><h3><a href="http://git-scm.com/book/en/v2/GitHub-Account-Setup-and-Configuration">Account Setup and Configuration</a></h3><p></p><h3><a href="http://git-scm.com/book/en/v2/GitHub-Account-Setup-and-Configuration#Two-Factor-Authentication">Two Factor Authentication</a></h3><p>   If you click on the “Set up two-factor authentication" button,</p><p>   it will take you to a configuration page where you can choose to use</p><p>   a phone app to generate your secondary code (a “time based one-time password"),</p><p>   or you can have GitHub send you a code via SMS each time you need to log in.</p></div><H2>     6.2. Contributing to a Project</H2><div id="62"><h3><a href="http://git-scm.com/book/en/v2/GitHub-Contributing-to-a-Project">Forking Projects</a></h3><p></p><h3><a href="http://git-scm.com/book/en/v2/GitHub-Contributing-to-a-Project#The-GitHub-Flow">The GitHub Flow</a></h3><p>   GitHub is designed around a particular collaboration workflow, centered on Pull Requests.</p><p>   Here’s how it generally works:</p><p><ol><li>Create a topic branch from master.</li><li>Make some commits to improve the project.</li><li>Push this branch to your GitHub project.</li><li>Open a Pull Request on GitHub.</li><li>Discuss, and optionally continue committing.</li><li>The project owner merges or closes the Pull Request.</li></ol></p><h3><a href="http://git-scm.com/book/en/v2/GitHub-Contributing-to-a-Project#Advanced-Pull-Requests">Advanced Pull Requests</a></h3><p></p><h3>   Pull Requests as Patches</h3><p>   Most GitHub projects think about Pull Request branches as</p><p>   iterative conversations around a proposed change,</p><p>   culminating in a unified diff that is applied by merging.</p><h3>   Keeping up with Upstream</h3><p>   If your Pull Request becomes out of date or otherwise</p><p>   doesn’t merge cleanly, you will want to fix it so</p><p>   the maintainer can easily merge it.</p><p>   If you want to merge in the target branch to make your Pull Request mergeable,</p><p>   you would ap the original repository as a new remote, fetch from it,</p><p>   merge the main branch of that repository into your topic branch,</p><p>   fix any issues and finally push it back up to the same branch you opened the Pull Request on.</p><h3><a href="http://git-scm.com/book/en/v2/GitHub-Contributing-to-a-Project#Markdown">Markdown</a></h3><p>   You can create a task list like this:</p><p><blockquote class="text-whitespaces">- [X] Write the code - [ ] Write all the tests - [ ] Document the code </blockquote></p></div><H2>     6.3. Maintaining a Project</H2><div id="63"><h3><a href="http://git-scm.com/book/en/v2/GitHub-Maintaining-a-Project#Managing-Pull-Requests">Managing Pull Requests</a></h3><p></p><h3>   Pull Request Refs</h3><p>   If you’re dealing with a lot of Pull Requests and don’t want to</p><p>   ap a bunch of remotes or do one time pulls every time,</p><p>   there is a neat trick that GitHub allows you to do</p><p>   To demonstrate this, we’re going to use a low-level command:</p><p>   [$ git ls-remote [remote repo | remote name]]</p><h3>   Special Files</h3><h3><a href="http://git-scm.com/book/en/v2/GitHub-Maintaining-a-Project#README">README</a></h3><p></p><h3><a href="http://git-scm.com/book/en/v2/GitHub-Maintaining-a-Project#CONTRIBUTING">CONTRIBUTING</a></h3><p>   If you have a file named CONTRIBUTING with any file extension, GitHub will show</p><p>   request to review its.</p><h3><a href="http://git-scm.com/book/en/v2/GitHub-Maintaining-a-Project#Project-Administration">Project Administration</a></h3><p></p></div><H2>     6.4. Managing an organization</H2><div id="64"><h3><a href"http://git-scm.com/book/en/v2/GitHub-Managing-an-organization#Organization-Basics="href"http://git-scm.com/book/en/v2/GitHub-Managing-an-organization#Organization-Basics">Organization Basics</a></h3><p></p><h3><a href"http://git-scm.com/book/en/v2/GitHub-Managing-an-organization#Teams="href"http://git-scm.com/book/en/v2/GitHub-Managing-an-organization#Teams">Teams</a></h3><p></p><h3><a href"http://git-scm.com/book/en/v2/GitHub-Managing-an-organization#Audit-Log="href"http://git-scm.com/book/en/v2/GitHub-Managing-an-organization#Audit-Log">Audit Log</a></h3><p></p></div><H2>     6.5. Scripting GitHub</H2><div id="65"><h3><a href="http://git-scm.com/book/en/v2/GitHub-Scripting-GitHub">Services</a></h3><p>   Most of them are for Continuous Integration services, bug and issue trackers, chat room systems and documentation systems.</p><h3><a href="http://git-scm.com/book/en/v2/GitHub-Scripting-GitHub">Hooks</a></h3><p>   If you need something more specific or you want to integrate with a service or site that is not included in</p><p>   this list, you can instead use the more generic hooks system. GitHub repository hooks are pretty simple</p><p>   You specify a URL and GitHub will post an HTTP payload to that URL on any event you want.</p><h3><a href="http://git-scm.com/book/en/v2/GitHub-Scripting-GitHub#The-GitHub-API">The GitHub API</a></h3><p>   Services and hooks give you a way to receive push notifications about</p><p>   events that happen on your repositories, but what if you need more</p><p>   information about these events? What if you need to automate</p><p>   something like aping collaborators or labeling issues?</p><p>   This is where the GitHub API comes in handy.</p><h3><a href="http://git-scm.com/book/en/v2/GitHub-Scripting-GitHub#Octokit">Octokit</a></h3><p>   For complete documentation on the entire API as well as guides for common tasks, check out<a href="https://developer.github.com.">   developer.github.com</a></p></div><h1>     7. Git Tools</h1><H2>     7.1. Managing an organization</H2><div id="71"><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Revision-Selection">Revision Selection</a></h3><p>   Git allows you to specify specific commits or a range of commits in several ways.</p><p>   They aren’t necessarily obvious but are helpful to know.</p><h3>   Single Revisions</h3><p>   You can obviously refer to a commit by the SHA-1 hash that it’s given,</p><p>   but there are more human-friendly ways to refer to commits as well.</p><p>   This section outlines the various ways you can refer to a single commit.</p><h3>   Short SHA-1</h3><p>   Git can enough precisely to figure out what you had meant if</p><p>   your partial SHA-1 commit is typed at leas 4 characters and unambiguous.</p><p>   For example, the following commands are equivalent:</p><p>   [$ git show 1c002p4b536e7479fe34593e72e6c6c1819e53b ]</p><p>   [$ git show 1c002p4b536e7479f                       ]</p><p>   [$ git show 1c002d                                   ]</p><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Revision-Selection#Branch-References">Branch References</a></h3><p>   You can use a name branch in any GIT command that expects a commit object or SHA-1 value.</p><p>   Specific SHA-1 points of any branch you can take with plumbing tool called [rev-parse].</p><p>   More info<a href="http://git-scm.com/book/en/v2/ch10/_git_internals">  see here.</a></p><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Revision-Selection#RefLog-Shortnames">RefLog Shortnames</a></h3><p>   While you are in workflow Git automatically keeps a "reflog" -</p><p>   log of where your HEAD and branch refs have been for the last few month.</p><p>   You can see thats with [$ git reflog] command.</p><p>   And you can specify older commits use @{n} reference that you see in the reflog output.</p><p>   You can also use this syntax to see where a branch was some specific amount of time ago:</p><p>   [$ git show master@{yesterday}]</p><p>   To see reflog information formatted like the git log output: [$ git log -g]</p><p>   All reflogs strictly local and after you clone a repo, you\'ll get an empty reflog.</p><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Revision-Selection#Ancestry-References">Ancestry References</a></h3><p>   If you place "^" at the end of a reference (branch, HEAD, SHA-1), Git resolves it to means "the parent of that commit".</p><p>   Or if you pace "^n", GIT resolves it to means "N parent of reference".</p><p>   The other main ancestry specification is the "~".</p><p>   If "~" just plased at end ref, it equivalent "^".</p><p>   If you specify a number, "~2" it\'ll means "the first parent of the first parent"</p><p>   - it traverses the first parents the number of times you specify.</p><p>   You can also written something like "HEAD^^^" or (equivalent) "HEAD~3", or combine them "HEAD~3^2" and so on.</p><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Revision-Selection#Commit-Ranges">Commit Ranges</a></h3><p>   Now that you can specify individual commits, let’s see how to specify ranges of commits.</p><h3>   Double Dot</h3><p>   [$ git log [refA]..[refB]]</p><p>   This basically asks Git to resolve a range of commits that</p><p>   are reachable from one commit but aren’t reachable from another.</p><p>   If the last ref unspecified - GIT substitutes its with HEAD.</p><h3>   Multiple Points</h3><p>   If you want to specify more than two branches to indicate your revision</p><p>   Git allows you to do this by using either the ^ character or</p><p>   --not before any reference from which you don’t want to see reachable commits.</p><p>   Thus these three commands are equivalent:</p><p>   [$ git log refA..refB ]</p><p>   [$ git log ^refA refB ]</p><p>   [$ git log refB --not refA ]</p><h3>   Triple Dot</h3><p>   [[$ git log [refA]...[refB]]]</p><p>   This syntax specifies all the commtis that are not common of two refs.</p><p>   You can also use the [--left-right] switch,</p><p>   which shows you which side of the range each commit is in.</p></div><H2>     7.2. Interactive Staging</H2><div id="72"><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Interactive-Staging#Staging-Patches">Staging Patches</a></h3><p>   [$ git ap -i]</p></div><H2>     7.6. Rewriting History</H2><div id="76"><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Rewriting-History#Changing-Multiple-Commit-Messages">Changing Multiple Commit Messages</a></h3><p>   [$ git rebase -i [refs range]]</p><p>   With interactive rebase tool, you can then stop after each commit you</p><p>   you want to modify and change the message, ap files, or do whatever you wish:</p><p>   [$ git rebase -i HEAD~3] - this will rebase you commits of range of three commits</p><p>   back from head you are.</p><p>   Remember: every commit that is rebasing will be rewritten,</p><p>   whether you change message or not.</p></div><H2>     7.7. Reset Demystified</H2><div id="77"><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified">Reset Demystified</a></h3><p></p><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified#The-Three-Trees">The Three Trees</a></h3><p><table class="table table-striped"><tbody><tr><th>   Tree</th><th>   Role</th></tr><tr><td>   HEAD</td><td>   Last commit snapshot, next parent</td></tr><tr><td>   Index</td><td>   Proposed next commit snapshot</td></tr><tr><td>   Working Directory</td><td>   Sandbox</td></tr></tbody></table></p><p>   By “tree" here we really mean “collection of files", not specifically the data structure.</p><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified#The-Role-of-Reset">The Role of Reset</a></h3><p></p><h3 title="(--soft)">Step 1: Move HEAD (--soft)</h3><p>   This isn’t the same as changing HEAD itself (which is what checkout does)</p><p>   reset moves the branch that HEAD is pointing to.</p><h3 title="the Index (--mixed)">Step 2: Updating the Index (--mixed)</h3><p>   This is the default option wher you run reset command.</p><p>   The next thing reset will do is to update the Index</p><p>   with the contents of whatever snapshot HEAD now points to.</p><h3 title="the Working Directory (--hard)">Step 3: Updating the Working Directory (--hard)</h3><p>   The third thing that reset will do</p><p>   is to make the Working Directory look like the Index.</p><p>   We could back our last commit with [$ git reflog] command.</p><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified#Reset-With-a-Path">Reset With a Path</a></h3><p>   [$ git reset [path to file]] where</p><p>   is the just shortand for [$ git reset --mixed HEAD file.txt]</p><p>   So it essentially just copies file.txt from HEAD to the Index.</p><p>   This has the practical effect of unstaging the file.</p><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified#Squashing">Squashing</a></h3><p>   You can "squash" your dirty commit with reset command.</p><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified#Check-It-Out">Check It Out</a></h3><p>   Like reset, checkout manipulates the three trees, and it is a bit different</p><p>   depending on whether you give the command a file path or not.</p><h3>   Without Paths</h3><p>   [$ git checkout [branch] is pretty similar to running [$ git reset --hard [branch]]</p><p>   in that it updates all three trees for you to look like [branch]</p><p>   but there are two important differences:</p><p><ol><li>Checkout will check to make sure it’s not blowing away files that have changes to them.</li><li>Checkout will move HEAD itself to point to another branch (ulike reset that will move the branch that HEAD points to)</li></ol></p><h3>   With Paths</h3><p>   [$ git checkout [REF] file]</p><p>   In that case checkout updates the index with that file at that commit,</p><p>   but it also overwrites the file in the working directory.</p><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified#Summary">Cheat-sheet</a></h3><p>   Pleas, checkout link for more info.</p></div><H2>     7.8. Advanced Merging</H2><div id="78"><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging#Merge-Conflicts">Merge Conflicts</a></h3><p>   Before doing merging, try to make sure your working directory is clean.</p><p>   If you have work in progress, either commit it to a temporary branch or stash it.</p><p>   This makes it so that you can undo anything you try here.</p><h3>   Aborting a Merge</h3><p>   You can simply back out of the merge with [$ git merge --abort].</p><p>   Aborting merging no be able perfectly if you had unstashed, uncommited</p><p>   changes in your working directory.</p><h3>   Ignoring Whitespace</h3><p>   If you see that you have a lot of whitespace</p><p>   you can simply abort merge it and do it again with</p><p>   [$ git merge -Xignore-all-space] or [-Xignore-space-change] options (latest in priority).</p><p>   First option ignores whitespace completely when comparing lines</p><p>   Second treats sequences of one or more whitespace characters as equivalent.</p><h3>   Manual File Re-merging</h3><p>   As an example, let’s pretend that Git could not</p><p>   handle the whitespace change and we needed to do it by hand.</p><h3>   Checking Out Conflicts</h3><p>   [$ git checkout --conflict]</p><p>   Where [--conflict] will re-checkout the file again and replace the merge conflict markers.</p><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging#Undoing-Merges">Undoing Merges</a></h3><p>   There are two ways to approach this problem, depending on what your desired outcome is.</p><h3>   Fix the references</h3><p>   Ir your changes only exists on your local repository, the easies and best solution is:</p><p>   [$ git reset --hard HEAD~]</p><h3>   The downside of this approach is that it’s rewriting history</h3><p>   which can be problematic with a shared repository.</p><p>   If other people have the commits you’re rewriting, you should probably avoid reset</p><p>   This approach also won’t work if any other commits have been created since the merge</p><p>   moving the refs would effectively lose those changes.</p><h3>   Reverse the commit</h3><p>   [$ git revert -m 1 HEAD]</p><p>   The -m 1 flag indicates which parent is the “mainline” and should be kept.</p><p>   Git will get confused if you try to merge reverted branch with previous second branch that was merged.</p><h3>   Subtree Merging</h3><p>   The idea of the subtree merge is that you have two projects,</p><p>   and one of the projects maps to a subdirectory of the other one and vice versa.</p></div><H2>     7.9. Rerere</H2><div id="79"><h3>   Rerere</h3><p>   Reuse recorded resolution</p><p>   To enable this functionality have run this config setting:</p><p>   [$ git config --global rerere.enabled true]</p><p>   This tool is allow your Git to remember how you had resolved a hunk</p><p>   conflict so that the next time it sees the same conflict,</p><p>   Git can automatically resolve it for you.</p><p>   For example, it might be really handy if you want to keep a branch</p><p>   rebased so you don’t have to deal with the same rebasing</p><p>   conflicts each time you do it.</p></div><H2>     7.10. Debugging with Git</H2><div id="710"><h3>   Debugging with Git</h3><p></p><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Debugging-with-Git#File-Annotation">File Annotation </a></h3><p>   [$ git blame -L [range-min,range-max] [file]]</p><p>   If you want to know by whom in the particular file the bug was previously introduced ,</p><p>   this is often your best tool for do that.</p><p></p><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Debugging-with-Git#Binary-Search">Binary Search</a></h3><p>   [$ git bisect start]</p><p>   The bisect command does a binary search through your commit history to help</p><p>   you identify as quickly as possible which commit introduced an issue.</p></div><H2>     7.11. Submodules</H2><div id="711"><h3>   Submodules</h3><p>   Submodules allow you to keep a Git repository as a subdirectory of another Git repository.</p><p>   This lets you clone another repository into your project and keep your commits separate.</p><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Submodules#Starting-with-Submodules">Starting with Submodules</a></h3><p>   [$ git submodule ap [REPOSITORY]]</p><h3>   .gitmodules</h3><p>   This is a configuration file that stores the mapping between</p><p>   the project’s URL and the local subdirectory you’ve pulled it into:</p><p>   Although DbConnector is a subdirectory in your working directory,</p><p>   Git sees it as a submodule and doesn’t track its contents when you’re not in that directory.</p><p>   Instead, Git sees it as a particular commit from that repository.</p><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Submodules#Cloning-a-Project-with-Submodules">Cloning a Project with Submodules </a></h3><p>   When you clone such a project, by default you get the directories</p><p>   that contain submodules, but none of the files within them yet.</p><p>   You must run two commands:</p><p><ol><li>[$ git submodule init]     - to initialize your local configuration file.</li><li>[$ git submodule update ]  - to fetch all the data from that project and check out the appropriate commit listed in your superproject.</li></ol></p><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Submodules#Working-on-a-Project-with-Submodules">Working on a Project with Submodules</a></h3><p></p><h3>   Pulling in Upstream Changes</h3><p>   The simplest model  of using submodules in a project</p><p>   it consume a subproject as as like any other repo.ю</p><p>   [$ git submodule update --remote]</p><p>   By default it will update all of your submodules</p><p>   Another way to do that is passing --recursive to the git clone command.</p><p>   You can set default branch to your submodules by either in .gitmodules file</p><p>   or jus in your local .git/config:</p><p>   [$ git config -f .gitmodules submodule.NAME_OF_YOUR_SUBMODULE.branch [YOUR PREFER BRANCH NAME]]</p><p>   Further you can just update your submodules::</p><p>   [$ git submodule update --remote]</p><p>   If you set the configuration setting status.submodulesummary,</p><p>   Git will also show you a short summary of changes to your submodules</p><p>   [$ git config status.submodulesummary 1]</p><h3>   Working on a Submodule</h3><p></p><h3>   Publishing Submodule Changes</h3><p>   [$ git push --recurse-submodules=check]</p><p>   [$ git push --recurse-submodules=on-demand]</p><h3>   Merging Submodule Changes</h3><p></p><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Submodules#Submodule-Tips">Submodule Tips</a></h3><p>   Click for more info. There are a few things you can do to make working a little easier.</p><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Submodules#Issues-with-Submodules">Issues with Submodules</a></h3><p>   Using submodules isn’t without hiccups, however.</p></div><H2>     7.12. Bundling</H2><div id="712"><h3>   Bundling</h3><p>   [$ git bundle create [file name] [REF | ..]]</p><p>   Git is capable of “bundling” its data into a single file.</p><p>   To create repo from bundle: [$ git clone [path to .bundle file]]</p><p>   To import changes from bundle into an existing repo: [$ git fetch [path to .bundle file] [branch:branch_local] etc..]</p></div><H2>     7.13. Replace</H2><div id="713"><h3><a href="http://git-scm.com/book/en/v2/Git-Tools-Replace">Replace</a></h3><p>   The replace command lets you specify an object in Git</p><p>   and say “every time you see this, pretend it’s this other thing”.</p></div><h1>8.1 Customizing Git</h1><h1> Related terms<H2>         Misc</H2><div id="Misc"><h3>     GPG</h3><p>     - GNU Privacy Guard</p><p>     HEAD  is the pointer that points to the current branch or any a commit.</p><p>     todo: it\'s need to be revised</p><p>     INDEX is the current state of files of repository which to be included to next commit</p><h3>     Useful hints:</h3><p><ol><li> [$ gitk]                            - built-in git GUI</li><li> [$ git config color.ui true]        - use colorful git output</li><li> [$ git config format.pretty oneline]- show log on just one line per commitM</li><li> [$ git ap -i]                      - use interactive aping</li><li> [$ git gui]</li></ol></p><h3>     Other</h3><p><ul><li>  aping for tracking(or staging) : git ap [dir]</li><li>  dChecking status                : git status</li><li>  dChecking status (short)        : git status -s</li></ul></p><h3>     git-shell</h3><p>     It is the shell that used instead the default system platform (bash) shell</p><p>     to the git-server authorization process. (chapter 4.4.)</p><p>     For security reasons.</p></div></h1>';

/***/ })
/******/ ]);