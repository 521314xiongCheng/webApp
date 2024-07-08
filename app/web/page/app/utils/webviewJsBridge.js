function setupWebViewJavascriptBridge(callback) {
  if (WebViewJavascriptBridge) {
    return callback(WebViewJavascriptBridge);
  }
  throw new Error('window.WebViewJavascriptBridge Is Not Defined')
}
function JavascriptBridge(key, data) {
  return new Promise((resolve, reject) => {
    try {
      WebViewJavascriptBridge.callHandler(key, data || {}, function () { });

      WebViewJavascriptBridge.registerHandler(`${key}Listener`, function (response, responseCallback) {
        responseCallback && responseCallback(response);
        resolve(response);
      });
    } catch (error) {
      reject(error);
    }
  });
}

const WebviewJsBridge = {
  getAccessToken() {
    return new Promise((resolve, reject) => {
      setupWebViewJavascriptBridge(function (bridge) {
        // console.log('bridge',bridge)
        bridge.callHandler("getAccessToken", null, function (response) {
          // console.log(response)
          resolve(response);
        });
      });
    });
  },
  getUserProfile() {
    return new Promise((resolve, reject) => {
      setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler("getUserProfile", null, function (response) {
          resolve(response);
        });
      });
    });
  },
  saveSharePoster(args) {
    return new Promise(async (resolve, reject) => {
      // const args = {
      // 	image:
      // 		"http://file02.16sucai.com/d/file/2014/0501/f3c159e2e263b99462ff0bdd8f87c31a.jpg",
      // 	qrcode:
      // 		"http://bpic.588ku.com/element_origin_min_pic/00/96/79/2156f30b287e7ce.jpg",
      // 	name: "Lily.Wang",
      // };
      setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler("saveSharePoster", args, function (response) {
          resolve(response);
        });
      });
    });
  },
  downloadVideo(videoUrl, progressCB) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('downloadVideo 1')
        setupWebViewJavascriptBridge(function (bridge) {
          console.log('downloadVideo 2')
          bridge.registerHandler('downloadFileProgress', function (data, responseCallback) {
            //data为{"totalSize":99999,"downloadedSize":333,"url":"https://xxx/1.jpeg"}
            console.log('downloadVideo 4', data)
            try {
              data = typeof data === 'string' ? JSON.parse(data) : data
              progressCB && progressCB(data)
            } catch (error) {
              throw new Error(error)
            }
          })
        })
        console.log('downloadVideo 3')
        let result = await JavascriptBridge("downloadFile", { enableProgress: true, type: "video", url: videoUrl })
        result = typeof result === 'string' ? JSON.parse(result) : result
        resolve(result)
      } catch (error) {
        reject(error)
      }
    });
  },
  downloadVideoV2(videoUrl, progressCB) {
    return new Promise((resolve, reject) => {
      setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler("downloadFileV2", { enableProgress: true, fileType: "video", url: videoUrl }, function (response) {
          console.log(response)
          response = typeof response === 'string' ? JSON.parse(response) : response
          resolve(response);
        });
        bridge.registerHandler('downloadFileProgress', function (data) {
          try {
            data = typeof data === 'string' ? JSON.parse(data) : data
            progressCB && progressCB(data)
          } catch (error) {
            throw new Error(error)
          }
        })
      });
    });
  },
  downloadPhoto(photoUrl, progressCallback) {
    return new Promise(async (resolve, reject) => {
      setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler("downloadFileV2", { enableProgress: true, fileType: "photo", url: photoUrl }, function (response) {
          console.log(response)
          response = typeof response === 'string' ? JSON.parse(response) : response
          resolve(response);
        });
        bridge.registerHandler('downloadFileProgress', function (data) {
          try {
            data = typeof data === 'string' ? JSON.parse(data) : data
            progressCallback && progressCallback(data)
          } catch (error) {
            reject(error)
          }
        })
      });
    });
  },
  downloadFile(params, progressCallback) {
    return new Promise(async (resolve, reject) => {
      setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler("downloadFileV2", params, function (response) {
          console.log('downloadFile', response)
          response = typeof response === 'string' ? JSON.parse(response) : response
          resolve(response);
        });
        bridge.registerHandler('downloadFileProgress', function (data) {
          try {
            data = typeof data === 'string' ? JSON.parse(data) : data
            progressCallback && progressCallback(data)
          } catch (error) {
            reject(error)
          }
        })
      });
    });
  },
  shareLocalFile(filePath) {
    // JavascriptBridge('shareLocalFile', filePath, function (data) {
    //   console.log('shareLocalFile',data)
    // })
    return new Promise(async (resolve, reject) => {
      setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler("shareLocalFile", filePath, function (response) {
          resolve(response);
        });
      });
    });
  },
  savePhoto(filePath) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await JavascriptBridge("saveFile", { enableProgress: false, fileType: "photo", filePath })
        resolve(res)
      } catch (error) {
        reject(error)
      }
    });
  },
  saveBase64Photo(base64String) {
    return new Promise(async (resolve, reject) => {
      setupWebViewJavascriptBridge(function (bridge) {
        base64String = base64String.split(',')[1]
        bridge.callHandler("saveBase64Photo", base64String, function (response) {
          resolve(response);
        });
      });
    });
  },
  saveVideo(filePath) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await JavascriptBridge("saveFile", { enableProgress: false, fileType: "video", filePath })
        resolve(result)
      } catch (error) {
        reject(error)
      }
    });
  },
  shareToWechat(args) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await JavascriptBridge("shareToWechat", args)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    });
  },
  openSchema(url) {
    return new Promise((resolve, reject) => {
      setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler("openSchema", url, function (response) {
          // console.log(response)
          resolve(response);
        });
      });
    });
  },
  openBrowser(url) {
    return new Promise((resolve, reject) => {
      setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler("openBrowser", url, function (response) {
          resolve(response);
        });
      });
    });
  },
  onFronted(callback) {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.registerHandler('onFronted', function (data) {
        data = typeof data === 'string' ? JSON.parse(data) : data
        callback && callback(data)
      })
    })
  },
  track(params) {
    // {"behavior": "eventName", "item_type": "xx", "item_id": "xx", "context": "pagename"}
    params.module = 'Library'
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('trackBehaviorLogs', params, function (response) {
        console.log('JS got response', response)
      })
    });
  },
  stopBusy() {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('stopBusy', null, function (response) {
        console.log('JS got response', response)
      })
    });
  },
  startBusy() {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('startBusy', null, function (response) {
        console.log('JS got response', response)
      })
    });
  },
  closeNativeWebview(url) {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('closeNativeWebview', url, function (response) {
        console.log('JS got response', response)
      })
    });
  },
  setFullScreen() {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('setFullScreen', null, function (response) {
        console.log('setFullScreen', response)
      })
    });
  },
  resetToPortraitScreen() {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('resetToPortraitScreen', null, function (response) {
        console.log('JS got response', response)
      })
    });
  },
  screenRotationNotification(callback) {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.registerHandler('screenRotationNotification', function (data) {
        callback && callback(data)
      })
    });
  },
  setAllowRotateScreen(type = true) {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('setAllowRotateScreen', { isSupport: type }, function (response) {
        console.log('setAllowRotateScreen', response)
      })
    });
  },
  s3ImagePicker(args) {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('s3ImagePicker', args, function (s3url) {
        console.log('s3ImagePicker', s3url)
      })
    });
  },
  audioRecorder(type) {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('audioRecorder', type, function (audio) {
        console.log('audioRecorder', audio)
      })
    });
  }
};

export default WebviewJsBridge;
