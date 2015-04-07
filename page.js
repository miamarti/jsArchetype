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
            'data' : json
        } });
    },
    
    main : function(){
        page.setTree([
           { "id" : "resources", "parent" : "#", "text" : "resources" },
           { "id" : "js", "parent" : "resources", "text" : "js" },
           { "id" : "ajson3", "parent" : "js", "text" : "Child 1", "icon" : "glyphicon glyphicon-file" },
           { "id" : "ajson4", "parent" : "js", "text" : "Child 2", "icon" : "glyphicon glyphicon-file" }
        ]);
    }
};
page.main();
