/* =======================================================
	Copyright 2018 - ePortfolium - Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://opensource.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
   ======================================================= */

/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}
 
//==================================
UIFactory["TextFieldBlock"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'TextFieldBlock';
	//--------------------
	this.text_node = $("asmContext:has(metadata[semantictag='txtblock-textfield'])",node);
	this.text_nodeid = this.text_node.attr('id');
	this.text_editresroles = ($(this.text_node[0].querySelector("metadata-wad")).attr('editresroles')==undefined)?'':$(this.text_node[0].querySelector("metadata-wad")).attr('editresroles');
	//--------------------
	this.image_node = $("asmContext:has(metadata[semantictag='txtblock-image'])",node);
	this.image_nodeid = this.image_node.attr('id');
	this.image_editresroles = ($(this.image_node[0].querySelector("metadata-wad")).attr('editresroles')==undefined)?'':$(this.image_node[0].querySelector("metadata-wad")).attr('editresroles');
	//--------------------
	this.cover_node = $("asmContext:has(metadata[semantictag='txtblock-cover'])",node);
	this.cover_nodeid = this.cover_node.attr('id');
	this.cover_editresroles = ($(this.cover_node[0].querySelector("metadata-wad")).attr('editresroles')==undefined)?'':$(this.cover_node[0].querySelector("metadata-wad")).attr('editresroles');
	//--------------------
	this.multilingual = ($("metadata",node).attr('multilingual-node')=='Y') ? true : false;
	this.display = {};
};


/// Display
//==================================
UIFactory["TextFieldBlock"].prototype.getView = function(dest,type,langcode)
//==================================
{
	var text = UICom.structure["ui"][this.text_nodeid];
	var image = UICom.structure["ui"][this.image_nodeid];
	var cover = UICom.structure["ui"][this.cover_nodeid];
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = {langcode: langcode, type : type};
	}
	//---------------------
	if (type==null)
		type = "standard";
	//---------------------
	var html = "";
	if (type=='standard'){
		//---------------------
		var img_langcode = langcode;
		if (!image.multilingual)
			img_langcode = NONMULTILANGCODE;
		//---------------------
		var txt_langcode = langcode;
		if (!text.multilingual)
			txt_langcode = NONMULTILANGCODE;
		//----------------------------------------
		var img_width = ($(image.resource.width_node[langcode]).text()!=undefined && $(image.resource.width_node[langcode]).text()!='') ? $(image.resource.width_node[langcode]).text() : "";
		var img_height = ($(image.resource.height_node[langcode]).text()!=undefined && $(image.resource.height_node[langcode]).text()!='') ? $(image.resource.height_node[langcode]).text() : "";
		if (img_width!="" && img_width.indexOf('px')<0)
			img_width += "px";
		if (img_height!="" && img_height.indexOf('px')<0)
			img_height += "px";
		var image_size = "";
		if (img_width!="")
			image_size += " width:"+img_width + ";";
		if (img_height!="")
			image_size += " height:" + img_height + ";";
		//----------------------------------------
		var style = "background-image:url('../../../"+serverBCK+"/resources/resource/file/"+image.id+"?lang="+languages[img_langcode]+"&timestamp=" + new Date().getTime()+"'); " +image_size;
		if (cover!=undefined && cover.resource.getValue()=='1')
			style += " background-size:cover;";
		html += "<div class='TxtBlock' style=\""+style+"\">";
		//---------------------------------
		var title = UICom.structure.ui[this.id].getLabel(uuid);
		var title_style = UICom.structure.ui[this.id].getLabelStyle(uuid);
		if (title!="")
			html += "<div id='title_"+this.id+"' class='block-title' style=\""+title_style+"\">"+title+"</div>";
		//---------------------------------
		var text_style = text.getContentStyle(uuid);
		var text_content = text.resource.getView(dest,type,langcode);
		html += "<div id='text_"+this.id+"' class='block-text' style=\""+text_style+"\">"+text_content+"</div>";
		//---------------------------------
		html += "</div>";
	}
	return html;
};

//==================================
UIFactory["TextFieldBlock"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	var html = this.getView(dest,type,langcode);
	$("#"+dest).html(html);
	$("#std_node_"+this.id).attr('style','visibility:hidden');
	$("#menus-"+this.id).hide();
};

//==================================
UIFactory["TextFieldBlock"].prototype.getButtons = function(dest,type,langcode)
//==================================
{
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var html = "";
	if (this.text_editresroles.containsArrayElt(g_userroles) || this.image_editresroles.containsArrayElt(g_userroles)){
		html += "<span data-toggle='modal' data-target='#edit-window' onclick=\"javascript:getEditBox('"+this.id+"')\"><span class='button fas fa-pencil-alt' data-toggle='tooltip' data-title='"+karutaStr[LANG]["button-edit"]+"' data-placement='bottom'></span></span>";
	}
	if (html!="")
		html = "<div class='buttons-menus' id='btn-spec-"+this.id+"'>" + html + "</div><!-- #btn-+node.id -->";
	return html;
};

//==================================
UIFactory["TextFieldBlock"].prototype.displayEditor = function(destid,type,langcode)
//==================================
{
	var text = UICom.structure["ui"][this.text_nodeid];
	var image = UICom.structure["ui"][this.image_nodeid];
	var cover = UICom.structure["ui"][this.cover_nodeid];
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (this.text_editresroles.containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer'){
		$("#"+destid).append($("<h4>Text</h4>"));
		text.resource.displayEditor(destid,type,langcode);
		$("#"+destid).append($("<div id='text-metadata' class='metadata'></div>"));
		text.displayMetadataEpmAttributeEditor('text-metadata','node-font-weight',$(text.metadataepm).attr('node-font-weight'));
		text.displayMetadataEpmAttributeEditor('text-metadata','node-font-style',$(text.metadataepm).attr('node-font-style'));
		text.displayMetadataEpmAttributeEditor('text-metadata','node-text-align',$(text.metadataepm).attr('node-text-align'));
		text.displayMetadataEpmAttributeEditor('text-metadata','node-font-size',$(text.metadataepm).attr('node-font-size'));
		text.displayMetadataEpmAttributeEditor('text-metadata','node-padding-top',$(text.metadataepm).attr('node-padding-top'));
		text.displayMetadataEpmAttributeEditor('text-metadata','node-color',$(text.metadataepm).attr('node-color'));
		text.displayMetadataEpmAttributeEditor('text-metadata','node-background-color',$(text.metadataepm).attr('node-background-color'));
		text.displayMetadataEpmAttributeEditor('text-metadata','node-othercss',$(text.metadataepm).attr('node-othercss'));

	}
	//---------------------
	if (this.image_editresroles.containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer'){
		$("#"+destid).append($("<h4>Image</h4>"));
		$("#"+destid).append($("<div>"+karutaStr[LANG]['block-image-size']+"</div>"));
		image.resource.displayEditor(destid,type,langcode,this);
	}
	//---------------------
	if (cover!=undefined && this.cover_editresroles.containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer'){
		$("#"+destid).append($("<h4>Coverage</h4>"));
		cover.resource.displayEditor(destid,type,langcode,this);
	}
}

//==================================
UIFactory["TextFieldBlock"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,this.display[dest].type,this.display[dest].langcode));
	};

};
