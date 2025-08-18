using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using UnityEngine;
using UnityEngine.SceneManagement;


public class PlayerMovement : MonoBehaviour
{
    public float moveSpeed = 10f;  // Speed of the player movement
    private Vector2 movement;  // Store the player's movement input
    private float dashCoolDown = 2f;
    private float currentDashCoolDown = 0f;

    // Update is called once per frame
    void Update()
    {
        // Get input from player for horizontal (left/right) and vertical (up/down) movement
        movement.x = Input.GetAxisRaw("Horizontal");  // A/D or Left/Right Arrow
        movement.y = Input.GetAxisRaw("Vertical");    // W/S or Up/Down Arrow
        transform.Translate(movement * moveSpeed * Time.deltaTime);
        if (Input.GetKeyDown(KeyCode.Tab))
        {
            Dash();
        }
    }

    // // FixedUpdate is called at a fixed interval and is used for physics calculations
    // void FixedUpdate()
    // {
    //     // Apply the movement to the player's Rigidbody2D
    //     rb.MovePosition(rb.position + movement * moveSpeed * Time.fixedDeltaTime);
    // }
    private void Dash()
    {
        if(movement.x < 0)
            movement.x -= 50f;
        else if(movement.x > 0)
            movement.x += 50f;
        if(movement.y < 0)
            movement.y -= 50f;
        else if (movement.y > 0)
            movement.y += 50f;

        transform.Translate(movement * moveSpeed * Time.deltaTime);
    }
}
