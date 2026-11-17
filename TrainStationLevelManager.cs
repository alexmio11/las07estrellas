// TrainStationLevelManager.cs — Controlador de Mundo 2 (Tren de las 02:30 PM)
using System.Collections;
using UnityEngine;
using UnityEngine.SceneManagement;
using TMPro;

public class TrainStationLevelManager : MonoBehaviour
{
    [Header("Reloj de Salida del Tren (02:25 PM -> 02:30 PM = 300 seg)")]
    public float trainRemainingSeconds = 300f;
    public bool trainTimerRunning = true;
    public int romanticTokensCollected = 0;
    public int totalTokensRequired = 3; // Boletos 02:30 PM, Rosa del Paseo, Foto Instantánea
    public bool reachedStationOnTime = false;

    [Header("Referencias UI")]
    public TextMeshProUGUI trainTimerText;
    public TextMeshProUGUI speakerNameText;
    public TextMeshProUGUI dialogueBodyText;
    public GameObject victoryTrainModal;

    void Update() {
        if (!trainTimerRunning || reachedStationOnTime) return;
        trainRemainingSeconds -= Time.deltaTime;
        if (trainRemainingSeconds <= 0f) {
            trainRemainingSeconds = 300f; // Reinicio suave si pierden el tren
            dialogueBodyText.text = "¡El tren de las 02:30 PM estuvo a punto de partir! El Sistema rebobina 5 minutos...";
        }
        int m = Mathf.FloorToInt(trainRemainingSeconds / 60f);
        int s = Mathf.FloorToInt(trainRemainingSeconds % 60f);
        if (trainTimerText != null) trainTimerText.text = $"{m:00}:{s:00}";
    }

    public void ApplyObstacleDelay(string obstacleName) {
        trainRemainingSeconds = Mathf.Max(15f, trainRemainingSeconds - 12f);
        speakerNameText.text = "EL DUQUE (TOMANDO TU MANO)";
        dialogueBodyText.text = $"¡Cuidado con {obstacleName}! No me sueltes la mano, Princesa, vamos por aquí.";
    }

    public void ReachTrainPlatform() {
        if (romanticTokensCollected < totalTokensRequired || reachedStationOnTime) return;
        reachedStationOnTime = true;
        trainTimerRunning = false;
        if (GameSessionManager.Instance != null) {
            GameSessionManager.Instance.UnlockWorldStar(2, "Promesa en el Tren de las 02:30 PM");
        }
        victoryTrainModal.SetActive(true);
    }

    public void BoardTrainToWorld3() {
        SceneManager.LoadScene("Mundo3_Recuerdo3");
    }
}