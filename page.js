$(document).on("pageload",function(){
    console.log('Yes!!!');
    
    var page = {
        editor : CodeMirror.fromTextArea(document.getElementById("condeConfig"), {
          lineNumbers: true,
          matchBrackets: true,
          styleActiveLine: true,
          matchBrackets: true,
          theme : 'monokai'
        }),
        
        setTree : function(json){
            $('#filesTree').jstree({ 'core' : {
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
