use uuid::Uuid;

pub fn generate() -> String {
    Uuid::new_v4().to_simple().to_string()
}
