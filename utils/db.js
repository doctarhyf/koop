import { ReadFile } from "../helpers/funcs";
import { KOOP_BUCKET_NAME, TABLE_NAMES, supabase } from "./supabase";

export const UPDATE_SUCCESS = null;

export async function getItem(tableName, rowName, rowVal) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq(rowName, typeof rowVal === "Number" ? Number(rowVal) : rowVal)
    .order("created_at", { ascending: false });

  console.log(
    `Loading items from '${tableName}' where '${rowName}'='${rowVal}'\n`,
    data,
    error
  );

  if (error) {
    return error;
  }

  return data[0];
}

export async function removeService(item) {
  const promises = [];
  const { photos } = item;

  photos.forEach(async (it, i) => {
    const splits = it.split("/");
    const filePath = `${splits[splits.length - 2]}/${
      splits[splits.length - 1]
    }`;
    console.error("Removing file => ", filePath);
    const p = await supabase.storage.from(KOOP_BUCKET_NAME).remove(filePath);
    promises.push(p);
  });

  let r = await Promise.all(promises);

  console.warn("Del photos promisAll res => ", r);

  r = await supabase.from(TABLE_NAMES.KOOP_ITEMS).delete().eq("id", item.id);

  console.warn("del items => ", r);

  return r;
}

export async function updatePersShopInfo(user, dataKey, newValue) {
  // const res = `Update koop_users set ${dataKey} = ${newValue}, where id = ${user.id}`;

  /*  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(res);
    }, 2500)
  ); */

  const res = await updateUserData(user.id, { [dataKey]: newValue });

  console.error(res);
  return res;
}

export async function getUser(phone, pin, onSuccess, onError) {
  const { data, error } = await supabase
    .from(TABLE_NAMES.KOOP_USERS)
    .select("*")
    .eq("phone", phone)
    .eq("pin", pin);

  if (error) {
    onError(error);
    console.log(error);
    return;
  }

  if (data && data.length === 0) {
    const err = `Phone : ${phone} and pin: ${pin} cant be found!`;
    const obj = { error: true, code: "USER_NOT_FOUND", message: err };
    onError(obj);
    return obj;
  }

  onSuccess(data[0]);
  return data[0];
}

export async function sendMessage(from_id, to_id, message) {
  let pout = insertItem(TABLE_NAMES.KOOP_MSG_OUTBOX, {
    from_id: from_id,
    to_id: to_id,
    message: message,
  });
  let pin = insertItem(TABLE_NAMES.KOOP_MSG_INBOX, {
    from_id: from_id,
    to_id: to_id,
    message: message,
  });

  const r = await Promise.all([pout, pin]);

  console.error("Result message out => \n", r);

  return r;
}

export async function insertItem(tableName, itemData) {
  const { data, error } = await supabase
    .from(tableName)
    .insert([itemData])
    .select();

  if (error) {
    console.error(error);
    return error;
  }

  return data;
}

export async function getItemByRowEqVal(
  tableName,
  rowName,
  val,
  onSuccess,
  onError
) {
  let { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq(rowName, val);

  if (error) {
    onError(error);
    return error;
  }

  if (data && data.length === 0) {
    const error = {
      error: true,
      message: `Item with ${rowName} = ${val} cant be found!`,
    };
    onError(error);
    return error;
  }

  onSuccess(data[0]);
  return data[0];
}

export async function updateUserData(uid, upd) {
  const tableName = TABLE_NAMES.KOOP_USERS;
  const colName = "id";

  const { data, error } = await supabase
    .from(tableName)
    .update(upd)
    .eq(colName, uid)
    .select();

  console.warn(
    `Updating ${tableName} with " ${JSON.stringify(
      upd
    )} where  " ${colName} = ${uid} " `
  );

  if (error) {
    console.error("Error updating data:", error.message);
    return error;
  } else {
    console.warn("Update successful! => ", data);
    return data;
  }
}

export async function getPublicUrl(path, onSuccess) {
  const res = await supabase.storage.from("koop").getPublicUrl(path);

  if (res) {
    const purl = res.data.publicUrl;
    onSuccess && onSuccess(purl);
    return purl;
  }

  return null;
}

export async function uploadPic(uri, remotePath, mimeType, onSuccess, onError) {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const { data, error } = await supabase.storage
    .from(KOOP_BUCKET_NAME)
    .upload(remotePath, decode(base64), { contentType: mimeType });

  console.log("Profile pic uploaded!\n", data);
  if (data) {
    onSuccess(data);
    return;
  }

  if (error) {
    onError(error);
  }
}

export async function loadAllItems(tableName) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .order("created_at", { ascending: false });

  console.log(`Loading all items from '${tableName}\n'`, data, error);

  if (error) {
    return error;
  }

  return data;
}

export async function loadItem(tableName, rowName, rowVal) {
  console.error(`Loading from ${tableName} where ${rowName} == ${rowVal}`);

  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq(rowName, rowVal)
    .order("created_at", { ascending: false });

  console.log(`Loading all items from '${tableName}\n'`, data, error);
  console.error(data, error);

  if (error) {
    return error;
  }

  return data[0];
}

export async function loadAllItemsWhereRowEqVal(tableName, rowName, rowVal) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq(rowName, typeof rowVal === "Number" ? Number(rowVal) : rowVal)
    .order("created_at", { ascending: false });

  console.log(
    `Loading items from '${tableName}' where '${rowName}'='${rowVal}'\n`,
    data,
    error
  );

  if (error) {
    return error;
  }

  return data;
}

export async function deleteOldProfile(oldUri) {
  if (oldUri === null || oldUri === undefined || oldUri.length === "") {
    console.error("Old profile is not defined!");
    return;
  }
  const parts = oldUri.split("/");
  const partsLen = parts.length;
  const removePath = `${parts[partsLen - 2]}/${parts[partsLen - 1]}`;
  const res = await supabase.storage.from(KOOP_BUCKET_NAME).remove(removePath);

  console.error("res del old prof :==> ", res);
}
