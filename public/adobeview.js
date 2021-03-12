document.addEventListener("adobe_dc_view_sdk.ready", function()
    {   //SERVER URL
        let serverURL = "https://pdf-convertor-server.herokuapp.com"; //UPDATE
        //PDF EMBED API CLIENT ID
        let embedClientId = "4e32a2d2a6fe4d18ae4c873d968c2837"; //UPDATE

        let viewDiv = document.getElementById("pdfviewercontainer");
        let fileName = viewDiv.getAttribute("pdf-file");
        const viewerConfig = {
            defaultViewMode: "FIT_WIDTH",  //default mode is set to fit_page
            embedMode: "FULL_WINDOW",     //display mode is set to inline
            showPageControls : true,  //display controls
            dockPageControls:true, //user can dock/undock
            showAnnotationTools: true, //display annotation tools
            showDownloadPDF : true,  //display download option
            showPrintPDF:true,  //display print option
            showLeftHandPanel: false,
              /* Enable commenting APIs */
            enableAnnotationAPIs: true /* Default value is false */,
            /* Include existing PDF annotations and save new annotations to PDF buffer */
            includePDFAnnotations: true /* Default value is false */,   
        };
        // custom flags for UI configurations
        const customFlags = {
            downloadWithAnnotations: true /* Default value is false */,
            printWithAnnotations: true /* Default value is false */,
        };
        // eslint-disable-next-line
        var adobeDCView = new AdobeDC.View({clientId: embedClientId, divId: "adobe-dc-view"});
        
        var previewFilePromise = adobeDCView.previewFile(
        {
            content:   {location : {url: `${serverURL}/viewpdf/${fileName}`}},
            metaData: {fileName : `${fileName}`, id:`${fileName}`}
        }, viewerConfig);

        //user profile name UI config
        let profile = {
          userProfile: {
            name: localStorage.getItem('email')
          },
        };

        adobeDCView.registerCallback(
        // eslint-disable-next-line
        AdobeDC.View.Enum.CallbackType.GET_USER_PROFILE_API,
        function () {
          //eslint-disable-next-line
          return new Promise((resolve, reject) => {
            resolve({ 
              // eslint-disable-next-line
              code: AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
              //set user name instead of guest
              data: profile,
            });
          });
        }
      );
          //annotations apis manager
    previewFilePromise.then(function (adobeViewer) {
      adobeViewer.getAnnotationManager().then(function (annotationManager) {
        //set UI configurations
        annotationManager
          .setConfig(customFlags)
          .then(function () {})
          .catch(()=>{});

        //array to store annotations
        var oldAnnos = [];
        //updating annotations automatically
        setInterval(async () => {
          await fetch(`${serverURL}/copycontract/annotations/find`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              'Content-Type': "application/json",
              'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ fileId: `${fileName}` }),
          })
            .then((response) => {
              return response.json();
            })
            .then((res) => {    
              let updatedAnnos = [];
              res.forEach((r) => {
                updatedAnnos.push(r.data);
              });
              //updated annos contains the updated version of annotations
              //if the present annos are different than updated ones, then updates it otherwise not
              if (JSON.stringify(updatedAnnos) !== JSON.stringify(oldAnnos)) {
                let result = updatedAnnos.filter((ol) => {
                  return !oldAnnos.some((o2) => {
                    return ol.id === o2.id;
                  });
                });
                //add annotations through annotationManager API
                annotationManager
                  .addAnnotations(result)
                  .then(function () {})
                  .catch(() => {});
                //updates the present annos
                oldAnnos = oldAnnos.concat(result);
              }
            });
        }, 5000);

        /* API to register events listener */
        annotationManager.registerEventListener(
          function (event) {
            switch (event.type) {
              // if annotations are added
              case "ANNOTATION_ADDED":
                if (event.data.bodyValue !== "") {
                  try {
                    if (
                      //if the user doesn't give any position to annotation, it will default go to this boundingBox location
                      //therefore checking if the two obejcts are same and then updating the position to right,lower position of the PDF page.
                      JSON.stringify(event.data.target.selector.boundingBox) ===
                      JSON.stringify([
                        594.4658823529412,
                        774.1270588235294,
                        611.2376470588235,
                        792.7623529411765,
                      ])
                    ) {
                      event.data.target.selector.boundingBox = [0, 0, 0, 0];
                    }
                  } catch (error) {error}
                  //update added annotation to database storage by sending event data with POST request
                  (async () => {
                    await fetch(`${serverURL}/copycontract/annotations/add`, {
                      method: "POST",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        'Access-Control-Allow-Origin': '*',
                      },
                      body: JSON.stringify({
                        data: event.data,
                        fileId: `${fileName}`,
                      }),
                    });
                  })();
                }
                break;
              case "ANNOTATION_UPDATED":
                //update updated annotation to database storage by sending event data with POST request
                (async () => {
                  await fetch(`${serverURL}/copycontract/annotations/update`, {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                      'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify({ data: event.data, fileId: `${fileName}` }),
                  });
                })();
                break;
              //delete annotation from the database storage by sending event data with POST request
              case "ANNOTATION_DELETED":
                (async () => {
                  await fetch(`${serverURL}/copycontract/annotations/delete`, {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                      'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify({ data: event.data, fileId: `${fileName}` }),
                  });
                })();
                break;
                default:null;
            }
          },
          {
            /* Pass the list of events in listenOn. */
            /* If no event is passed in listenOn, then all the annotation events will be received. */
            listenOn: [],
          }
        );

      });
    });      
})
