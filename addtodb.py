import mysql.connector

mydb = mysql.connector.connect(
    host="db-mysql-fra1-82542-do-user-13612104-0.b.db.ondigitalocean.com",
    port="25060",
    user="doadmin",
    password="AVNS_zHy1PorZO9bMRWu5LA1",
    database="defaultdb"
)

mycursor = mydb.cursor()


statements = [
        

        "DROP TABLE IF EXISTS `Graph_Network`",
        "DROP TABLE IF EXISTS `Similarity_Type`",
        "DROP TABLE IF EXISTS `Edge`",
        """CREATE TABLE `Graph_Network`(
            `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            `start` DATE NOT NULL,
            `end` DATE NOT NULL,
            `aggregate` INT UNSIGNED NOT NULL,
            `type` INT UNSIGNED NOT NULL,
            `similarity_type` INT UNSIGNED NOT NULL,
            PRIMARY KEY(`id`)
        )""",
        """CREATE TABLE `Similarity_Type`(
            `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            `name` VARCHAR(255) NOT NULL,
            PRIMARY KEY(`id`)
        )""",
        """CREATE TABLE `Edge`(
            `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            `source` VARCHAR(255) NOT NULL,
            `target` VARCHAR(255) NOT NULL,
            `graph` INT UNSIGNED NOT NULL,
            `weight` DECIMAL(20,18) NOT NULL,
            PRIMARY KEY(`id`)
        )""",
        """ALTER TABLE
            `Graph_Network` ADD CONSTRAINT `graph_similarity_foreign` FOREIGN KEY(`similarity_type`) REFERENCES `Similarity_Type`(`id`)""",
        """ALTER TABLE
            `Edge` ADD CONSTRAINT `edge_source_foreign` FOREIGN KEY(`source`) REFERENCES `Company`(`ticker`)""",
        """ALTER TABLE
            `Edge` ADD CONSTRAINT `edge_target_foreign` FOREIGN KEY(`target`) REFERENCES `Company`(`ticker`)""",
        "INSERT INTO `Similarity_Type` (name) VALUES ('euclidean_based')",
        "INSERT INTO `Similarity_Type` (name) VALUES ('gaussian_based')"
]
"""ALTER TABLE
            `Edge` ADD CONSTRAINT `edge_graph_foreign` FOREIGN KEY(`graph`) REFERENCES `Graph`(`id`)"""

for statement in statements:
    try:
        mycursor.execute(statement)
        for x in mycursor:
            print(x)
    except mysql.connector.Error as e:
        print(e)

mycursor.execute("SHOW TABLES")

for x in mycursor:
    print(x)

mydb.commit()

mydb.close()
