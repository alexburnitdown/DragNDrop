<%@ Page language="C#" %>

<% Response.Buffer = false; %>

<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Import Namespace = "System" %>
<%@ Import Namespace = "System.Globalization" %>
<%@ Import Namespace = "System.Collections.Generic" %>
<%@ Import Namespace="System.Web.Script.Serialization" %>
<%

Response.Buffer = false;
Response.ContentType = "application/json";

SPWeb web = SPContext.Current.Web;
//web.AllowUnsafeUpdates = true;

int i = 0;
string st = "";
string q = "";

SPListItemCollection it_coll;

SPList list_files  = web.Lists["Файлы: Библиотека"];

SPListItem item;

int	id = 0;

if(Request.QueryString["id"] != null) {
	id = Convert.ToInt32(Request.QueryString["id"]);
}


if(id != 0) {

	item = list_files.GetItemById(id);

	st  = "{";
	st += "\"id\":"				+ item["ID"].ToString()											+ "  ,";
	// st += "\"dt\":\""			+ item.GetFormattedValue("_x0414__x0430__x0442__x0430_")	+ "\",";

	st += "\"name\":\"";		if(item["FileLeafRef"]	!= null)	st += prepJ(item["FileLeafRef"].ToString()); st += "\",";
	st += "\"tag\":\"";		if(item["_x0422__x0435__x0433_"] != null)	st += prepJ(item["_x0422__x0435__x0433_"].ToString()); st += "\",";
	// st += "\"reciever\":\"";	if(item["_x041f__x043e__x043b__x0443__x040"] != null)	st += prepJ(item["_x041f__x043e__x043b__x0443__x040"].ToString()); st += "\",";
	// st += "\"sender\":\"";		if(item["_x041e__x0440__x0433__x0430__x04"] != null)	st += prepJ(item["_x041e__x0440__x0433__x0430__x04"].ToString()); st += "\",";
	// st += "\"kolvo\":\"";		if(item["_x041a__x043e__x043b__x002d__x04"] != null)	st += prepJ(item["_x041a__x043e__x043b__x002d__x04"].ToString()); st += "\",";
	// st += "\"prim\":\"";		if(item["_x041f__x0440__x0438__x043c__x04"] != null)	st += prepJ(item["_x041f__x0440__x0438__x043c__x04"].ToString()); st += "\",";

	st += "\"author\":\"" 		+ item["Author"].ToString().Split('#')[1] + "\",";
	st += "\"editor\":\"";
	if(item["Editor"] != null) {
		st += item["Editor"].ToString().Split('#')[1];
	}
	st += "\",";
	st += "\"created\":\"" 		+ DateTime.Parse(item["Created"].ToString()).AddHours(-1).ToString() + "\",";
	st += "\"modified\":\"";
	if(item["Modified"] != null) {
		st += DateTime.Parse(item["Modified"].ToString()).AddHours(-1).ToString();
	}
	st += "\" ";
	// st += "\"files\":";			if(item["Files"] != null)		{ st += item["Files"]; } else { st += "0"; }; st += "," ;
	// st += "\"folders\":";		if(item["Folders"] != null)	{ st += item["Folders"]; } else { st += "0"; };
	st += "}";

	Response.Write(st);

}









Response.End();
%>

<!--#include virtual="/inc/functions.aspx"-->