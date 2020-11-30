<%@ Page language="C#" %>

<% Response.Buffer = false; %>

<%@ Import Namespace = "System" %>
<%@ Import Namespace = "System.IO" %>
<%@ Import Namespace = "System.Globalization" %>
<%@ Import Namespace = "System.Collections.Generic" %>
<%@ Import Namespace = "System.Collections.Generic" %>
<%@ Import Namespace = "Microsoft.SharePoint" %>
<%@ Import Namespace = "Microsoft.SharePoint.WebControls" %>
<%@ Import Namespace = "Microsoft.SharePoint.Utilities" %>



<%

Response.ContentType = "application/json";

SPWeb web = SPContext.Current.Web;
web.AllowUnsafeUpdates = true;

int i = 0;

string item_id		= ""; if(Request.Form["item_id"]		!= null) item_id		= Request.Form["item_id"].ToString();
string item_tag		= ""; if(Request.Form["item_tag"]		!= null) item_tag		= Request.Form["item_tag"].ToString();
// string file_library = ""; if(Request.Form["file_library"]	!= null) file_library	= Request.Form["file_library"].ToString();
// string file_path	= ""; if(Request.Form["file_path"]		!= null) file_path		= Request.Form["file_path"].ToString();

//Response.Write("item_tag = " + item_tag);


// file_path = file_path.Replace("/","\\");

string path = "\\DocLib27\\";

//Response.Write(path);

HttpFileCollection files = Page.Request.Files;
int files_count = files.Count;
string file_name = "";
Boolean replaceExistingFiles = true;
HttpPostedFile file = null;
System.IO.Stream ffstream = null;

// if(!web.GetFolder("\\" + file_library + "\\" + item_id + "\\").Exists) {

// 	SPFolderCollection folders = web.GetFolder("/" + file_library + "/").SubFolders;
// 	folders.Add(item_id);

// }

SPFolder dl = web.GetFolder(path);

if(files_count > 0)
{

	for(i = 0; i < files_count; i ++) {

		file_name = files[i].FileName;
		file_name = file_name.Split('\\')[file_name.Split('\\').Length-1];
		file = files[i];
		ffstream = file.InputStream ;
		SPFile spfile = dl.Files.Add(file_name, ffstream, replaceExistingFiles);
		//Response.Write(file_name + "<br>");
	}

		
	int row_amount = files_count;
	SPListItem file_item;
	SPListItemCollection it_coll;
	SPList list_docu  = web.Lists["Файлы: Библиотека"];
	SPQuery query = new SPQuery();
	string q = "";
	q  = "<Where>";
	q += "</Where>";
	q += "<OrderBy>";
	q += " <FieldRef Name='ID' Ascending='False'/>";
	q += "</OrderBy>";
	query.Query = q;
	query.RowLimit = (uint)row_amount;
	it_coll = list_docu.GetItems(query);
	
	foreach (SPListItem item in it_coll) {
		file_item = list_docu.GetItemById(Convert.ToInt32(item["ID"]));
		file_item["_x0422__x0435__x0433_"] = item_tag;
		file_item.Update();

	}


}




Response.Write("{\"message\":\"OK\"}");



Response.End();
%>

<!--#include virtual="/inc/functions1.aspx"-->