(function(){
    angular.module("anguComp.monacoEditor")
        .directive("angularMonacoDiffEditor",angularMonacoDiffEditor);

    angularMonacoDiffEditor.$inject = ["$parse"];

    function angularMonacoDiffEditor($parse) {
        return {
            restrict: "EA",
            template:'',
            controller:function(){},
            controllerAs:"$ctrl",
            scope: {
                options:"=",
                editorHeight:"@",
                editorWidth:"@",
                original:"=",
                modified:"="
            },
            link:function(scope,element,attrs) {
                /* retrieve code container */
                var editor;
                var codeEditorElement = angular.element('<div class="code-container" style="height:600px;width:800px;"></div>');
                element.append(codeEditorElement);
                init();

                /* Monaco editor initialization */
                function initializeEditor() {
                    var options = attrs.options || {};
                    
                    editor = monaco.editor.createDiffEditor(codeEditorElement[0], {
                        lineNumbers: options.lineNumbers || true,
                        theme: options.theme || "vs-dark",
                        automaticLayout: options.autoResize || false
                    });

                    editor.setModel({
                        original: monaco.editor.createModel(scope.original, "text/javascript"),
                        modified: monaco.editor.createModel(scope.modified, "text/javascript")
                    });
                }

                function setEditorHeight() {
                    var height = "600px"; // default
                    if(scope.editorHeight.indexOf("%") === scope.editorHeight.length - 1 ||
                        scope.editorHeight.indexOf("px") === scope.editorHeight.length - 2) {
                        height = scope.editorHeight;
                    } // add warning message if format is incorrect
                    return height;
                }

                function setEditorWidth() {
                    var width = "800px"; // default
                    if(scope.editorWidth.indexOf("%") === scope.editorWidth.length - 1 ||
                        scope.editorWidth.indexOf("px") === scope.editorWidth.length - 2) {
                        width = scope.editorWidth;
                    } // add warning message if format is incorrect
                    return width;
                }

                function init() {
                    initializeEditor();
                }
            }
        }
    }
})();