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
web.AllowUnsafeUpdates = true;

int id = 0;
string st = "";
string q = "";

SPListItemCollection it_coll;

SPFolder dl;

SPList list_docu  = web.Lists["Файлы: Библиотека"];
//SPList list_ish = web.Lists["Исходящие документы"];

if(Request.QueryString["id"] != null) {
	id = Convert.ToInt32(Request.QueryString["id"]);
}

SPListItem item;
item = list_docu.GetItemById(id);

dl = web.GetFolder("/DocLib27/" + id + "/");
dl.Recycle();

item.Recycle();

Response.Write("{\"message\":\"OK\"}");



Response.End();

%>