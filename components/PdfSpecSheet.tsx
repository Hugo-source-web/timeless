// components/PdfSpecSheet.tsx
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

export function PdfSpecSheet({ vehicle, sections, heroImage }: any) {
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontSize: 12,
      fontFamily: "Helvetica",
      color: "#222",
    },
    title: {
      fontSize: 28,
      textAlign: "center",
      marginBottom: 10,
      letterSpacing: 4,
      fontWeight: "bold",
    },
    hero: {
      width: "100%",
      height: 200,
      objectFit: "cover",
      borderRadius: 6,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 8,
      marginTop: 14,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 3,
    },
    footer: {
      marginTop: 30,
      textAlign: "center",
      fontSize: 10,
      opacity: 0.6,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* HEADER LOGO */}
        <Text style={styles.title}>TIMELESS</Text>

        {/* HERO IMAGE */}
        <Image src={heroImage} style={styles.hero} />

        {/* VEHICLE TITLE */}
        <View style={{ textAlign: "center", marginBottom: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {vehicle.brand} {vehicle.model} {vehicle.variant ?? ""}
          </Text>
          <Text style={{ opacity: 0.6, marginTop: 4 }}>
            Año {vehicle.year} · {vehicle.condition}
          </Text>
        </View>

        {/* SECTIONS */}
        {sections.map((section: any) => {
          const validRows = section.rows.filter(
            ([_, v]: any) => v !== null && v !== undefined
          );
          if (validRows.length === 0) return null;

          return (
            <View key={section.title}>
              <Text style={styles.sectionTitle}>{section.title}</Text>

              {validRows.map(([label, value]: any) => (
                <View key={label} style={styles.row}>
                  <Text>{label}</Text>
                  <Text>{value}</Text>
                </View>
              ))}
            </View>
          );
        })}

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text>
            {vehicle.dealership?.name} · {vehicle.dealership?.city}
          </Text>
          <Text>Generado el {new Date().toLocaleDateString()}</Text>
        </View>

      </Page>
    </Document>
  );
}
