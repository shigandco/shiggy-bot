plugins {
    id("java")
}

group = "fun.shiggy"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation ("com.google.code.gson:gson:2.10.1")
    implementation("com.discord4j:discord4j-core:3.3.0-RC1")
    testImplementation(platform("org.junit:junit-bom:5.9.1"))
    testImplementation("org.junit.jupiter:junit-jupiter")
}

tasks.test {
    useJUnitPlatform()
}