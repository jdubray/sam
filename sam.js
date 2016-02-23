

////////////////////////////////////////////////////////////////////////////////
// Model 
//
const COUNTER_MAX = 10 ;

var model = {
              items: [
                {
                  id: 1,
                  name: "Item 1",
                  description: "This is a description"
                },
                {
                  id: 2,
                  name: "Item 2",
                  description: "This is a description"
                }
              ],
              itemId : 3 
            } ;

model.present = function(data) {
    data = data || {} ;
    
    if (data.deletedItemId !== undefined) {
        var d = -1 ;
        model.items.forEach(function(el,index) {
            if (el.id !== undefined) {
                if (el.id == data.deletedItemId) {
                    d = index ;       
                }
            }
        });
        if (d>=0) {
            model.lastDeleted = model.items.splice(d,1)[0] ;
        }
    }
    
    if (data.lastEdited !== undefined) {
        model.lastEdited = data.lastEdited ;
    } else {
        delete model.lastEdited ;
    } 
    
    if (data.item !== undefined) {
        if (data.item.id !== null) {
            // has been edited
            model.items.forEach(function(el,index) {
                if (el.id !== undefined) {
                    if (el.id == data.item.id) {
                        model.items[index] = data.item ;       
                    }
                }
            });
            
        } else {
            // new item
            data.item.id = model.itemId++ ;
            model.items.push(data.item) ;
        }
    }
    
    state.render(model) ;
}


////////////////////////////////////////////////////////////////////////////////
// View
//
var view = {} ;

// Initial State
view.init = function(model) {
    return view.ready(model) ;
} ;

// State representation of the ready state
view.ready = function(model) { 
    model.lastEdited = model.lastEdited || {} ;
    var nameValue = model.lastEdited.name || 'Name' ;
    var descriptionValue = model.lastEdited.description || 'Description' ;
    var id = model.lastEdited.id || '' ;
    var cancelButton = '<button id="cancel" onclick="JavaScript:return actions.cancel({});\">Cancel</button>\n' ;
    var valAttr = "value" ;
    var actionLabel = "Save" ;
    var idElement = ', \'id\':\''+id+'\'' ;
    if (id.length === 0) { cancelButton = '' ; valAttr = "placeholder"; idElement = "" ; actionLabel = "Add"}
    var output = (
            '<div class=\"mdl-cell mdl-cell--6-col\">\n\
               '+model.items.map(function(e){
                   return(
                        '<h3 onclick="JavaScript:return actions.edit({\'name\':\''+e.name+'\', \'description\':\''+e.description+'\', \'id\':\''+e.id+'\'});">'+e.name+'</h3>\n'
                       +'<p>'+e.description+'</p>'
                       +'<button onclick="JavaScript:return actions.delete({\'id\':\''+e.id+'\'});">Delete</button>') ;
                   }).join('\n')+'\n\
             </div>\n\
             <div class="mdl-cell mdl-cell--6-col">\n\
               <input id="name" type="text" '+valAttr+'="'+nameValue+'">\n\
               <input id="description" type="text" '+valAttr+'="'+descriptionValue+'">\n\
               <button id="save" onclick="JavaScript:return actions.save({\'name\':document.getElementById(\'name\').value, \'description\': document.getElementById(\'description\').value'+idElement+'});">'+actionLabel+'</button>\n\
               '+cancelButton+'\n\
             </div>\n'
        ) ;
    console.log(output) ;
    return output ;
} ;


//display the state representation
view.display = function(representation) {
    var stateRepresentation = document.getElementById("representation");
    stateRepresentation.innerHTML = representation;
} ;

// Display initial state
view.display(view.init(model)) ;



////////////////////////////////////////////////////////////////////////////////
// State
//
var state =  { view: view} ;

model.state = state ;

// Derive the state representation as a function of the systen
// control state
state.representation = function(model) {
    var representation = 'oops... something went wrong, the system is in an invalid state' ;

    if (state.ready(model)) {
        representation = state.view.ready(model) ;
    } 
    
    state.view.display(representation) ;
} ;

// Derive the current state of the system
state.ready = function(model) {
   return true ;
} ;




// Next action predicate, derives whether
// the system is in a (control) state where
// an action needs to be invoked

state.nextAction = function(model) {} ;

state.render = function(model) {
    state.representation(model)
    state.nextAction(model) ;
} ;


////////////////////////////////////////////////////////////////////////////////
// Actions
//

var actions = {} ;

actions.edit = function(data, present) {
    present = present || model.present ;
    data.lastEdited = {name: data.name,  description: data.description, id: data.id } ;
    present(data) ;
    return false ;
} ;

actions.save = function(data, present) {
    present = present || model.present ;
    data.item = {name: data.name, description: data.description, id: data.id || null} ;
    present(data) ;
    return false ;
} ;

actions.delete = function(data, present) {
    present = present || model.present ;
    data = {deletedItemId: data.id} ;
    present(data) ;
    return false ;
} ;

actions.cancel = function(data, present) {
    present = present || model.present ;
    present(data) ;
    return false ;
} ;
