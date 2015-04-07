var page = {
    archetype : undefined,
    
    editor : CodeMirror.fromTextArea(document.getElementById("condeConfig"), {
      lineNumbers: true,
      matchBrackets: true,
      styleActiveLine: true,
      matchBrackets: true,
      theme : 'monokai'
    }),
    
    showResult : function(){
        $('#codeArea').removeClass('col-md-12');
        $('#codeArea').addClass('col-md-8');
        $('#treeArea').fadeIn('slow');
    },
    
    setSelected : function(file){
        console.log(file);
    },
    
    setTree : function(json){
        $('#filesTree').jstree({ 'core' : {
            "multiple" : false,
            'data' : json
        } }).on('changed.jstree', function(e, data) {
            var i, j, r = [];
            for(i = 0, j = data.selected.length; i < j; i++) {
              r.push(data.instance.get_node(data.selected[i]));
            }
            console.log(r[0]);
            page.setSelected(r[0].text);
        });
    },
    
    getGenerator : function(payload){
        var id = 0;
        var data = {
            jsArchetype : jsArchetype.run(payload),
            tree : [
               { "id" : "resources", "parent" : "#", "text" : "resources", "state" : { "opened" : true } },
               { "id" : "js", "parent" : "resources", "text" : "js", "state" : { "opened" : true } },
               { "id" : "controllers", "parent" : "js", "text" : "controllers" },
               { "id" : "models", "parent" : "js", "text" : "models" },
               { "id" : "services", "parent" : "js", "text" : "services" },
               { "id" : "App", "parent" : "resources", "text" : "App.js", "icon" : "glyphicon glyphicon-fire", "state" : { "selected" : true } }
            ]
        };
        
        data.jsArchetype.controllers.forEach(function(obj) {
            id++;
            data.tree.push({ "id" : id, "parent" : "controllers", "text" : obj.jsName, "icon" : "glyphicon glyphicon-leaf", "jsCode": obj.jsCode });
        });
        
        data.jsArchetype.services.forEach(function(obj) {
            id++;
            data.tree.push({ "id" : id, "parent" : "services", "text" : obj.jsName, "icon" : "glyphicon glyphicon-leaf", "jsCode": obj.jsCode });
        });
        
        data.jsArchetype.models.forEach(function(obj) {
            id++;
            data.tree.push({ "id" : id, "parent" : "models", "text" : obj.jsName, "icon" : "glyphicon glyphicon-leaf", "jsCode": obj.jsCode });
        });
        
        return data;
    },
    
    run : function(){
        page.archetype = page.getGenerator((new Function('return ' + page.editor.getValue() + ';'))());
        console.log(page.archetype);
        page.showResult();
        page.setTree(page.archetype.tree);
    },
    
    setEventlistner : function(){
        $('#btnRun').click(page.run);
    },
    
    main : function(){
        page.setEventlistner();
    }
};
$(document).ready(page.main);
