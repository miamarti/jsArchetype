var page = {
    editor : CodeMirror.fromTextArea(document.getElementById("condeConfig"), {
      lineNumbers: true,
      matchBrackets: true,
      styleActiveLine: true,
      matchBrackets: true,
      theme : 'monokai'
    }),
    
    setTree : function(json){
        console.log(json);
        $('#filesTree').jstree({ 'core' : {
            "multiple" : false,
            'data' : json
        } });
    },
    
    main : function(){
        page.setTree([
           { "id" : "resources", "parent" : "#", "text" : "resources" },
           { "id" : "js", "parent" : "resources", "text" : "js" },
           { "id" : "controllers", "parent" : "js", "text" : "controllers" },
           { "id" : "models", "parent" : "js", "text" : "models" },
           { "id" : "services", "parent" : "js", "text" : "services" },
           
           { "id" : "fileA", "parent" : "controllers", "text" : "fileA.js", "icon" : "glyphicon glyphicon-leaf" },
           { "id" : "fileB", "parent" : "controllers", "text" : "fileB.js", "icon" : "glyphicon glyphicon-file" },
           { "id" : "fileC", "parent" : "controllers", "text" : "fileC.js", "icon" : "glyphicon glyphicon-fire" },
           
           { "id" : "fileD", "parent" : "models", "text" : "fileD.js", "icon" : "glyphicon glyphicon-fire" },
           { "id" : "fileE", "parent" : "models", "text" : "fileE.js", "icon" : "glyphicon glyphicon-fire" },
           { "id" : "fileF", "parent" : "models", "text" : "fileF.js", "icon" : "glyphicon glyphicon-fire" },
           
           { "id" : "fileG", "parent" : "services", "text" : "fileG.js", "icon" : "glyphicon glyphicon-fire" },
           { "id" : "fileH", "parent" : "services", "text" : "fileH.js", "icon" : "glyphicon glyphicon-fire" },
           { "id" : "fileI", "parent" : "services", "text" : "fileI.js", "icon" : "glyphicon glyphicon-fire" }
        ]);
    }
};
page.main();
