$(document).on("pageload", function(){
    var page = {
        editor : CodeMirror.fromTextArea(document.getElementById("condeConfig"), {
          lineNumbers: true,
          matchBrackets: true,
          styleActiveLine: true,
          matchBrackets: true,
          theme : 'monokai'
        }),
        
        setTree : function(json){
            $('#using_json_2').jstree({ 'core' : {
                'data' : json
            } });
        }
    };
    
    page.setTree([
                   { "id" : "ajson1", "parent" : "#", "text" : "Simple root node" },
                   { "id" : "ajson2", "parent" : "#", "text" : "Root node 2" },
                   { "id" : "ajson3", "parent" : "ajson2", "text" : "Child 1" },
                   { "id" : "ajson4", "parent" : "ajson2", "text" : "Child 2" },
                ]);
});
