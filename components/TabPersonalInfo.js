import React from "react";
import { Feather } from "@expo/vector-icons";
import { colors } from "../theme";
import { Group, ListRow } from "./ui";

const TabPersonalInfo = ({ user, handleInfoPress }) => {
  const { full_name, display_name, dob, email, ville } = user;

  const personalInfo = {
    full_name: { value: full_name, icon: "user", placeholder: "Nom complet", editable: true, label: "Nom complet" },
    display_name: { value: display_name, icon: "at-sign", placeholder: "Pseudo", editable: false, label: "Pseudo" },
    dob: { value: dob, icon: "calendar", placeholder: "Date de naissance", editable: true, label: "Date de naissance" },
    email: { value: email, icon: "mail", placeholder: "Adresse email", editable: true, label: "Email" },
    ville: { value: ville, icon: "map-pin", placeholder: "Ville", editable: true, label: "Ville" },
  };

  const entries = Object.entries(personalInfo);

  return (
    <Group title="Informations personnelles">
      {entries.map((data, i) => (
        <ListRow
          key={data[0]}
          icon={data[1].icon}
          title={data[1].value || data[1].placeholder}
          subtitle={data[1].label}
          onPress={data[1].editable ? () => handleInfoPress(data) : undefined}
          right={!data[1].editable ? <Feather name="lock" size={14} color={colors.textFaint} /> : null}
          last={i === entries.length - 1}
        />
      ))}
    </Group>
  );
};

export default TabPersonalInfo;
