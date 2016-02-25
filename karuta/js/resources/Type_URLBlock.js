/* =======================================================
	Copyright 2016 - ePortfolium - Licensed under the
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
UIFactory["URLBlock"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'URLBlock';
	//--------------------
	this.url_nodeid = $("asmContext:has(metadata[semantictag='URL'])",node).attr('id');
	//--------------------
	this.image_nodeid = $("asmContext:has(metadata[semantictag='image'])",node).attr('id');
	//--------------------
	this.display = {};
};


/// Display
//==================================
UIFactory["URLBlock"].prototype.getView = function(dest,type,langcode)
//==================================
{
	var url_element = UICom.structure["ui"][this.url_nodeid];
	var image = UICom.structure["ui"][this.image_nodeid];
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	this.multilingual = ($("metadata",this.node).attr('multilingual-resource')=='Y') ? true : false;
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
		var url = $(url_element.resource.url_node[langcode]).text();
		if (url!="" && url.indexOf("http")<0)
			url = "http://"+url;
		var label = $(url_element.resource.label_node[langcode]).text();
		if (label=="")
			label = url;

		if (url!="") {
			html =  "<a style='text-decoration:none;color:inherit' id='url_"+url_element.id+"' href='"+url+"' target='_blank'>";
			html += "<div class='URLBlock' style=\"background-image:url('../../../"+serverFIL+"/resources/resource/file/"+image.id+"?lang="+languages[langcode]+"&timestamp=" + new Date().getTime()+"')\">";
			html += "<div class='docblock-title'>"+label+"</div>";
			html += "</div>";
			html += "</a>";
		} else {
			html =  "<div class='URLBlock no-document'>";
			html += "<div class='docblock-title'>"+karutaStr[LANG]['no-URL']+"</div>";
			html += "</div>";
		}
	}
	return html;
};


//==================================
UIFactory["URLBlock"].prototype.displayEditor = function(destid,type,langcode)
//==================================
{
	var url_element = UICom.structure["ui"][this.url_nodeid];
	var image = UICom.structure["ui"][this.image_nodeid];
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	this.multilingual = ($("metadata",this.node).attr('multilingual-resource')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	$("#"+destid).append($("<h4>URL</h4>"));
	$("#"+destid).append($(url_element.resource.getEditor()));
	//---------------------
	$("#"+destid).append($("<h4>Image</h4>"));
	image.resource.displayEditor(destid,type,langcode);
}




//==================================
UIFactory["URLBlock"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,this.display[dest].type,this.display[dest].langcode));
	};

};
