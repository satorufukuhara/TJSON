// Function to parse TJSON file
//
// Example (run `node tjson_parse.js`)
//  directory.tjson
//    | folder1   
//    | | folder2
//    | | |-file1
//    | |-file2
//    | folder3
// 
// object = tjson_parse("directory.tjson");
// console.log(JSON.stringify(object));
//
// result
//{   "hasChild":true,
//    "value":"root_directory",
//    "child":[
//        {
//            "hasChild":true,
//            "value":"folder1",
//            "child":[
//            {
//                "hasChild":true,
//                "value":"folder2",
//                "child":[
//                    {
//                        "hasChild":false,
//                        "value":"file1"
//                    }]
//            },
//            {
//                "hasChild":false,
//                "value":"file2"
//            }]
//        },
//        {
//            "hasChild":true,
//            "value":"folder3",
//            "child":[]
//        }
//    ]}

const fs = require("fs");

var tjson_parse = function(input_filename){
    var current_line = 0; // currently processing TJSON file's line
    var current_layer = 0; // Layer of Nested structure
    var loaded_data = {}; //Store line of input TJSON file

    let text = fs.readFileSync(input_filename, 'utf-8').split('\n');
    
    // Remove brank object
    text = text.filter(function(item){
        if(item.match(/\S/g)){ // \S means non brank object
            return item;
        };
    })

    console.log(text);

    // Set the root directory
    var initial_data = {};
    initial_data['hasChild'] = true;
    initial_data['layer'] = 0;
    initial_data['value'] = 'root_directory';

    // Main part
    return returnObject(initial_data);

    // Functions-----------------------------------
    function returnObject(data){
        loaded_data = data;
        console.log({loaded_data});

        // item is a folder (hence have a child object)
        if(loaded_data.hasChild){
            var child_list = [];
            var object = createFolderObject(loaded_data);
            
            var check_layer = loaded_data.layer; // for assert only
            current_layer += 1;

            loaded_data = load_item(text,current_line);
            current_line += 1;

            while(current_layer <= loaded_data.layer){ //Process all layer larger than current layer. Maybe, can be '==' rather than '<='
                //console.log(current_layer);
                child_list.push(returnObject(loaded_data));
            }
    
            //escaped the layer
            current_layer -= 1;
            console.assert(check_layer===current_layer,'\n should be '+check_layer+' but ' + current_layer);
            object['child'] = child_list;    
            return object;
        }
        
        // item is a file
        else{
            console.log('create file')
            var object = createFileObject(loaded_data);
            
            loaded_data = load_item(text,current_line);
            //console.log({loaded_data});

            current_line += 1;

            return object;
        }
    }

    function createFolderObject(data){
        var obj = {};
        obj['hasChild'] = true;
        obj['value'] = data.value; 
        return obj;
    }
    
    function createFileObject(){
        var obj = {};
        obj['hasChild'] = false;
        obj['value'] = loaded_data.value;
        return obj;
    }
}


// Load one line of the TJSON file
function load_item(text,current_line){
    var layer = 0;
    var haschild = 1;
    var loaded_data = {};
    const n_line = text.length;

    if(n_line <= current_line){ // The end of file
        loaded_data['hasChild'] = haschild;
        loaded_data['layer'] = -1;
        loaded_data['value'] = 'end';
        return loaded_data;
    }
    
    var input = text[current_line]; 
    var at = 0;
    var ch = input.charAt(at);


    function next(){
        at+= 1
        ch = input.charAt(at);
    }

    while(1){
        if(ch <= ' '){
            next();
            continue;
        } else if(ch ==='|'){
            layer+=1;
            next();
            continue;
        }else if(ch ==='-'){
            next();
            haschild = 0;
            continue;
        }else{
            break;
        }
    }
    var filename = input.substr(at).trim();
    loaded_data['hasChild'] = haschild;
    loaded_data['layer'] = layer;
    loaded_data['value'] = filename;
    current_line += 1;
    return loaded_data;
}

// Example
object = tjson_parse("directory.tjson");
console.log(JSON.stringify(object));